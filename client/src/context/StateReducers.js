import { reducerCases } from "./constants";

export const initialState = {
  userInfo: undefined,
  showLoginModal: false,
  showSignupModal: false,
  isSeller: false,
  gigData: undefined,
  hasOrdered: false,
  reloadReviews: false,
  hamburger: false,
  unverifiedmail: undefined,
  otpmodal: false,
  showTermsModal: false,

};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_USER:
      return {
        ...state,
        userInfo: action.userInfo,
      };
      case reducerCases.TOGGLE_HAMBURGER:
  return {
    ...state,
    hamburger: !state.hamburger,
  };
case reducerCases.CLOSE_HAMBURGER:
  return {
    ...state,
    hamburger: false,
  };

    case reducerCases.TOGGLE_LOGIN_MODAL:
      return {
        ...state,
        showLoginModal: action.showLoginModal,
      };

      case reducerCases.SET_UNVERIFIED_USER:
      return {
        ...state,
        unverifiedmail: action.unverifiedmail,
      };
    case reducerCases.OTP_MODAL:
      return {
        ...state,
        otpmodal: action.otpmodal,
      };
      

    case reducerCases.TOGGLE_TERMS_MODAL:
  return {
    ...state,
    showTermsModal: action.showTermsModal,
  };

      
    case reducerCases.TOGGLE_SIGNUP_MODAL:
      return {
        ...state,
        showSignupModal: action.showSignupModal,
      };
    case reducerCases.CLOSE_AUTH_MODAL:
      return {
        ...state,
        showSignupModal: false,
        showLoginModal: false,
      };
    case reducerCases.SWITCH_MODE:
      return {
        ...state,
        isSeller: !state.isSeller,
      };
    case reducerCases.SET_GIG_DATA:
      return {
        ...state,
        gigData: action.gigData,
      };

    case reducerCases.HAS_USER_ORDERED_GIG:
      return {
        ...state,
        hasOrdered: action.hasOrdered,
      };
    case reducerCases.ADD_REVIEW:
      return {
        ...state,
        gigData: {
          ...state.gigData,
          reviews: [...state.gigData.reviews, action.newReview],
        },
      };
    default:
      return state;
  }
};

export default reducer;