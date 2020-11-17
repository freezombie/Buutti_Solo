const Photos = (props) => {
    const {
        data
    } = props

    const singlePhoto = () => (

    );

    const photoArray = () => (

    );

    if(Array.isArray(data)) {
        return photoArray();
        
    }
    else {
        return singlePhoto();
    }
};

export default Photos;