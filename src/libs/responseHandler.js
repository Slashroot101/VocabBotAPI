module.exports = (res, message, data = {}) => {
    res.status(200);
    res.json({
      success: true,
      message,
      data
    });
  };