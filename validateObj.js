const validateObj = (obj) =>  {
    for (const property in obj) {
        if (typeof obj[`${property}`] !== 'string') {
            console.log('Invalid request, cannot add obj to DB')
            return false 
        }
    }

    if (Object.keys(obj).length !== 7) {
        console.log('Invalid request, cannot add obj to DB')
        return false
    } else {
        return true
    }   
}

module.exports = validateObj;