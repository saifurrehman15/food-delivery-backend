export const sendResponse = async (res, status, responseSend = {}) => {
 return res.status(status).json(responseSend);
};
