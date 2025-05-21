import { create } from 'zustand';

const useSignupStore = create((set) => ({
  signupData: {
    email: '',
    password: '',
    username: '',
  },
  setSignupField: (field, value) =>
    set((state) => ({
      signupData: {
        ...state.signupData,
        [field]: value,
      },
    })),
  resetSignupData: () =>
    set({
      signupData: {
        email: '',
        password: '',
        username: '',
      },
    }),
}));

export default useSignupStore;
