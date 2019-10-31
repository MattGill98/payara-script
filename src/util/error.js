export function handleError(msg, callback) {
    return err => {
      if (err) {
        console.error(msg);
        console.log(err.message);
      }
      if (callback) {
        callback();
      }
    };
}