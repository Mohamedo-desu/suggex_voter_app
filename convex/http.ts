import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// 1- WE NEED TO MAKE SURE THAT THE WEBHOOK EVENT IS COMING FROM CLERK
// 2- IF SO WE WILL LISTEN FOR THE USER.CREATED EVENT
// 3- IF THE EVENT IS USER.CREATED WE WILL CREATE THE USER IN THE DATABASE

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error(
        "Missing webhook secret. Please set CLERK_WEBHOOK_SECRET in your .env.local file."
      );
    }

    //   CHECK HEADERS
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Missing svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (error) {
      console.error("Error verifying webhook", error);
      return new Response("Error occurred", {
        status: 400,
      });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.user.createUser, {
          email,
          clerkId: id,
          image: image_url,
          fullname: name,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.log("Error creating user", error);
        return new Response("Error occurred", {
          status: 500,
        });
      }
    }
    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
