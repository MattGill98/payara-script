export function handleError(msg, callback) {
  return (err, data) => {
    if (err) {
      console.error(msg);
      console.log(err.message);
    }
    if (callback) {
      callback(data);
    }
  };
}