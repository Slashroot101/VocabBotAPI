exports.handleServerError = (err, res, message = `An unknown error occurred`) => {
    res
    .json({
        success: false,
        msg: message
    })
  };