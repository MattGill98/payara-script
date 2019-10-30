export function handleError(msg) {
    return err => {
      console.error(msg);
      console.log(err.message);
    };
}