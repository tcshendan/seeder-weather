export const resetRoute = () => (window.location.href = window.location.origin);

export const isSuccess = ({ res, success, fail }) => {
  if (res === null) return
  if (res.code === 200) {
    typeof (success) === 'function' && success(res.data);
  } else {
    typeof (fail) === 'function' && fail();
    return new Error(res);
  }
}