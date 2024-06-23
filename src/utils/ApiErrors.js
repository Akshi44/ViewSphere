// Informational responses (100 – 199)
// Successful responses (200 – 299)
// Redirection messages (300 – 399)
// Client error responses (400 – 499)
// Server error responses (500 – 599)


class ApiError extends Error{
    constructor(
        statusCode,
        messsage = "Something went wrong",
        errors = [],
        stack = "",
    ){
        super(messsage)         //Error class constructor is invoked with the message argument, initializing the error message.
        this.statusCode=statusCode
        this.data= null
        this.messsage=messsage
        this.success=false;
        this.errors=errors

        if(this.stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
} 

export {ApiError}