export function handleError(msg, callback) {
    return err => {
      console.error(msg);
      console.log(err.message);
      if (callback) {
        callback();
      }
    };
}