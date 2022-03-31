import callApi from '../../global/callApi'

const userLogin = async (email, password) => {
    const param = {
        email: email,
        password: password
    }
    const response = await callApi('login/', param)
    return response
}

const userRegistration = async (fname, lname, email, phone, password) => {
    const param = {
        fullname: fname + ' ' + lname,
        phone: phone,
        email: email,
        password: password,
    }
    console.log(param);
    const response = await callApi('newregister/', param)
    return response
}

const verifyCode = async (email, code) => {
    const param = {
        email: email,
        code: code
    };

    const response = await callApi('verify_email/', param)
    return response
}

const forgotPassword = async (email) => {
    const param = {
        email: email
    }
    const response = await callApi('forgot_pasword/', param);
    return response

}

const updateAccountData = async(  email, name, phone, password) => {

    const param = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    console.log(param);
    const response = await callApi('account_update/', param, 'put');
    return response
}

export { userLogin, userRegistration, verifyCode, forgotPassword, updateAccountData }