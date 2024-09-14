const developmentErrors = (res , error) =>{
    console.log('welcome to development error section');
    res.status(400).json({
        status: error.statusCode,
        message:error.message,
        point : error.stack,
        error:error
    })
}

const productionErrors = ( res , error) =>{
    console.log('welcome to production errors');
    if(error.isOperational){
        console.log('error is operational');
        res.status(error.statusCode).json({
            status: error.statusCode,
            message:error.message,            
        })
    }else{
        console.log('error is not operational')
        res.status(500).json({
            status:error,
            message:'something went wrong trt again later'
        })
    }
}
const errorHandler = (error , req , res , next) =>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        developmentErrors(res , error);
    }

    else if(process.env.NODE_ENV === 'production'){

        productionErrors(res , error);
    }
}

export default errorHandler;