import * as Yup from 'yup';

// Define validation schema using Yup
export const createValidationSchema = Yup.object().shape({
  group: Yup.object().required('Group is required'),
  suggestionTitle: Yup.string().required('Suggestion title is required'),
  suggestionDescription: Yup.string()
    .max(300, 'Maximum 300 characters allowed')
    .required('Suggestion description is required'),
  endGoal: Yup.number().min(3).max(1000000).required('End goal is required'),
  status: Yup.string().oneOf(['open', 'closed']).required('Status is required'),
});
