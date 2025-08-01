export const HOST = process.env.NEXT_PUBLIC_SERVER_URL;
// export const HOST = "https://api.knell.co.in";
export const API_URL = `${HOST}api`;
export const IMAGES_URL = `${HOST}uploads`;

export const AUTH_ROUTES = `${API_URL}/auth`;
export const GIG_ROUTES = `${API_URL}/gigs`;
export const ORDERS_ROUTES = `${API_URL}/orders`;
export const MESSAGES_ROUTES = `${API_URL}/messages`;
export const DASHBOARD_DATA_ROUTES = `${API_URL}/dashboard`;
export const MAIL_ROUTES = `${API_URL}/otp`;

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const GET_USER_INFO = `${AUTH_ROUTES}/get-user-info`;
export const SET_USER_INFO = `${AUTH_ROUTES}/set-user-info`;
export const SET_USER_IMAGE = `${AUTH_ROUTES}/set-user-image`;
export const ALL_USERS_ROUTE = `${AUTH_ROUTES}/all-users`;
export const VERIFY_USER_ROUTE = `${AUTH_ROUTES}/verify-user`;
export const DELETE_USER_ROUTE = `${AUTH_ROUTES}/delete-user`;
export const GET_USER_PUBLIC_PROFILE = `${AUTH_ROUTES}/user`;
export const FORGOT_PASSWORD = `${AUTH_ROUTES}/forgot-password`;

export const ADD_GIG_ROUTE=`${GIG_ROUTES}/add`;
export const GET_USER_GIGS_ROUTE=`${GIG_ROUTES}/get-user-gigs`;
export const GET_GIG_DATA=`${GIG_ROUTES}/get-gig-data`;
export const EDIT_GIG_DATA=`${GIG_ROUTES}/edit-gig`;
export const SEARCH_GIGS_ROUTE=`${GIG_ROUTES}/search-gigs`;
export const CHECK_USER_ORDERED_GIG_ROUTE=`${GIG_ROUTES}/check-gig-order`;
export const ADD_REVIEW=`${GIG_ROUTES}/add-review`;

export const CREATE_ORDER=`${ORDERS_ROUTES}/create`
export const ORDER_SUCCESS_ROUTE=`${ORDERS_ROUTES}/success`
export const GET_BUYER_DASHBOARD_DATA = `${DASHBOARD_DATA_ROUTES}/buyer`;
export const GET_BUYER_ORDERS_ROUTE=`${ORDERS_ROUTES}/get-buyer-orders`
export const GET_SELLER_REQUEST_ORDERS_ROUTE=`${ORDERS_ROUTES}/get-seller-requests`
export const GET_SELLER_ORDERS_ROUTE=`${ORDERS_ROUTES}/get-seller-orders`
export const DECLINE_ROUTE=`${ORDERS_ROUTES}/decline-order`
export const ORDER_COMPLETE_ROUTE=`${ORDERS_ROUTES}/complete`
export const ALL_ORDER_ROUTE=`${ORDERS_ROUTES}/all-orders`
export const DELETE_ORDER_ROUTE=`${ORDERS_ROUTES}/delete-orders`

export const GET_MESSAGES = `${MESSAGES_ROUTES}/get-messages`;
export const ADD_MESSAGE = `${MESSAGES_ROUTES}/add-message`;
export const GET_UNREAD_MESSAGES = `${MESSAGES_ROUTES}/unread-messages`;
export const MARK_AS_READ_ROUTE = `${MESSAGES_ROUTES}/mark-as-read`;

export const GET_SELLER_DASHBOARD_DATA = `${DASHBOARD_DATA_ROUTES}/seller`;

export const ADMIN_ROUTE=`${GIG_ROUTES}/get-all-gig-data`;
export const DELETE_GIG=`${GIG_ROUTES}/delete-gig`;

export const OTP_VERIFICATION = `${MAIL_ROUTES}/verify-otp`;
export const OTP_SEND = `${MAIL_ROUTES}/send-otp`;
export const SEND_FORGOT_OTP = `${MAIL_ROUTES}/send-forgot-otp`;
