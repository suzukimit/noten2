import {AuthActionsUnion, AuthActionTypes} from '../actions/auth.actions';

export interface State {
  error: string | null;
  afterSignup: boolean;
  pending: boolean;
}

export const initialState: State = {
  error: null,
  afterSignup: false,
  pending: false,
};

export function reducer(state = initialState, action: AuthActionsUnion): State {
  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        ...state,
        error: null,
        pending: true,
      };
    }

    case AuthActionTypes.LoginSuccess: {
      return {
        ...state,
        error: null,
        afterSignup: false,
        pending: false,
      };
    }

    case AuthActionTypes.LoginFailure: {
      return {
        ...state,
        // error: action.payload,
        error: 'メールアドレスかパスワードが間違っています',
        afterSignup: false,
        pending: false,
      };
    }

    case AuthActionTypes.SignupSuccess: {
      return {
        ...state,
        afterSignup: true,
      }
    }

    default: {
      return state;
    }
  }
}

export const getError = (state: State) => state.error;
export const getPending = (state: State) => state.pending;
export const getAfterSignup = (state: State) => state.afterSignup;
