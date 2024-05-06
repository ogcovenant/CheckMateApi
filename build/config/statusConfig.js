"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//an object that stores the status codes
const statusConfig = {
    status: {
        // infomation
        continue: 100,
        processing: 102,
        //success
        ok: 200,
        created: 201,
        noContent: 204,
        // client
        bad: 400,
        unauthorized: 401,
        paymentRequired: 402,
        forbidden: 403,
        notFound: 404,
        notAcceptable: 406,
        requestTimeout: 408,
        conflict: 409,
        gone: 410,
        tooLarge: 413,
        unsupportedMediaType: 415,
        unavailable: 451, //or 503
        tooManyRequests: 429,
        // server
        serverError: 500,
        insufficientStorage: 507,
        authRequired: 511,
    },
};
//exporting the status object
exports.default = statusConfig.status;