import * as actions from './actions'

const initialState = {
  pageData: {},
  featuredBlockData: {},
  loading: false,
  error: false
}

export function app (state = initialState, action) {
  switch (action.type) {
    case actions.FORM_REQUEST:
      return Object.assign({}, state, {
        loading: true
      })
    case actions.FORM_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        error: false,
        submitted: true
      })
    case actions.FORM_REQUEST_ERROR:
      return Object.assign({}, state, {
        status: action.status,
        errors: action.errors,
        error: true,
        loading: false
      })
    case actions.RECEIVE_PAGE:
      return Object.assign({}, state, {
        pageData: action.pageData,
        loading: false
      })
    case actions.REQUEST_PAGE:
      return Object.assign({}, state, {
        loading: true
      })
    case actions.RECEIVE_PAGE_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      })
    case actions.RECEIVE_FEATURED_BLOCK:
      return Object.assign({}, state, {
        featuredBlockData: action.featuredBlockData,
        loading: false
      })
    case actions.REQUEST_FEATURED_BLOCK:
      return Object.assign({}, state, {
        loading: true
      })
    case actions.RECEIVE_FEATURED_BLOCK_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        loading: false
      })
    default:
      return state
  }
}
