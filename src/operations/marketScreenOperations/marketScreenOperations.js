import callApi from '../../global/callApi'

const getAllBlog = async(category) => {
    if(category == 'All'){
        category = ''
    }
    const param = {
        category: category
    }
    const response = await callApi('blog/', param)
    return response
}

const getBlogDetails = async(blogItemid) =>{
    const param = {
        id: blogItemid
    }
    const response = await callApi('blog/', param)
    return response
}

export {getAllBlog,getBlogDetails}