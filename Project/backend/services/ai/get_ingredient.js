const axios = require("axios");


const get_ingredient = async (recipeName, jwt) => {
    response = {
        status: false,
        message: "AI Response Failed",
        data: ""
    }

    request = {recipeName};
    //Application of discrete 1 , demorgans law :)
    try {
        const data = await axios.post("http://127.0.0.1:5004/ai-model-ingredients", request);

        console.log(data.data);

        
        response.message = "AI Success";
        response.data = data.data;
        response.success = true;

        return response
    }catch (err) {
        console.log(err);
        response.message = "Internal Error"
        return response;
    }
}

module.exports = { get_ingredient };