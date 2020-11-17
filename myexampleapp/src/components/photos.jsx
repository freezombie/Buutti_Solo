const Photos = (props) => {
    const {
        data
    } = props

    const singleImageStyle = {
        display: "block",
        marginLeft: "auto", 
        marginRight: "auto",
    };

    const thumbnailStyle = {
        
    };

    const singlePhoto = (photoData) => (
        <div style={{ width: "100%" }}>
            <img src={photoData.url} style={ singleImageStyle } alt="" />
            <p style={{ textAlign: "center" }}> {photoData.title} </p>
        </div>
    );

    const selectImage = (item) => {
        photoArray(item);
    }

    const photoArray = (selectedImage) => {
        return (
            <div class="images">
                {console.log(selectedImage)}
                    {selectedImage ?
                    <div class="row">
                        <Photos data={selectedImage} />
                    </div> : "Nothing selected" + JSON.stringify(selectedImage) };
                <div class="row">
                { data.map((item, index) => (
                    <div key={index} className = "photosArray">
                        <img src={item.thumbnailUrl} style={ thumbnailStyle } alt="" onClick={() => selectImage(item)} /> 
                    </div>
                ))};
                </div>
            </div>
        )
    };

    if(Array.isArray(data)) {
        return photoArray();
    }
    else {
        const photoData = data;
        return singlePhoto(photoData);
    }
};

export default Photos;