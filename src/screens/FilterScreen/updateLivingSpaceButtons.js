const updateBedroom = (bedroom, index) => {

    //const { bedroom } = this.state;
    let newBedroomArray = { ...bedroom };

    if (index === 0) {
        const zeroIndex = newBedroomArray.activeIndexes.findIndex(
            (element) => element === 0,
        );
        if (zeroIndex == -1) {
            newBedroomArray.activeIndexes = [0];
        } else {
            newBedroomArray.activeIndexes = [-1];
        }
    } else {
        // newBedroomArray.activeIndexes = [index];
        const zeroIndex = newBedroomArray.activeIndexes.findIndex(
            (element) => element === 0,
        );

        if (zeroIndex !== -1) {
            newBedroomArray.activeIndexes.splice(zeroIndex, 1);
        }

        const findIndex = newBedroomArray.activeIndexes.findIndex(
            (element) => element === index,
        );

        if (findIndex === -1) {
            newBedroomArray.activeIndexes.push(index);
        } else {
            newBedroomArray.activeIndexes.splice(findIndex, 1);
        }

        if (newBedroomArray.activeIndexes.length === 0) {
            newBedroomArray.activeIndexes = [-1];
        }
    }

    return newBedroomArray
};

const updateBathroom = (bathroom, index) => {

    const newBathroomArray = { ...bathroom };

    if (index === 0) {
        const zeroIndex = newBathroomArray.activeIndexes.findIndex(
            (element) => element === 0,
        );
        if (zeroIndex == -1) {
            newBathroomArray.activeIndexes = [0];
        } else {
            newBathroomArray.activeIndexes = [-1];
        }
    } else {
        //newBathroomArray.activeIndexes = [index];
        const zeroIndex = newBathroomArray.activeIndexes.findIndex(
            (element) => element === 0,
        );

        if (zeroIndex !== -1) {
            newBathroomArray.activeIndexes.splice(zeroIndex, 1);
        }

        const findIndex = newBathroomArray.activeIndexes.findIndex(
            (element) => element === index,
        );

        if (findIndex === -1) {
            newBathroomArray.activeIndexes.push(index);
        } else {
            newBathroomArray.activeIndexes.splice(findIndex, 1);
        }

        if (newBathroomArray.activeIndexes.length === 0) {
            newBathroomArray.activeIndexes = [-1];
        }
    }

    return newBathroomArray
};

const updateKitchen = (kitchen, index) => {

    const newKitchenArray = { ...kitchen };

    if (index === 0) {
        const zeroIndex = newKitchenArray.activeIndexes.findIndex(
            (element) => element === 0,
        );
        if (zeroIndex == -1) {
            newKitchenArray.activeIndexes = [0];
        } else {
            newKitchenArray.activeIndexes = [-1];
        }
    } else {
        // newKitchenArray.activeIndexes = [index];
        const zeroIndex = newKitchenArray.activeIndexes.findIndex(
            (element) => element === 0,
        );

        if (zeroIndex !== -1) {
            newKitchenArray.activeIndexes.splice(zeroIndex, 1);
        }

        const findIndex = newKitchenArray.activeIndexes.findIndex(
            (element) => element === index,
        );

        if (findIndex === -1) {
            newKitchenArray.activeIndexes.push(index);
        } else {
            newKitchenArray.activeIndexes.splice(findIndex, 1);
        }

        if (newKitchenArray.activeIndexes.length === 0) {
            newKitchenArray.activeIndexes = [-1];
        }
    }

    return newKitchenArray
};

const updateGarage = (garage, index) => {

    let copyOfGarage = { ...garage };
    //copyOfGarage.activeIndex = index;

    if (index === 0) {
        const zeroIndex = copyOfGarage.activeIndexes.findIndex(
            (element) => element === 0,
        );
        if (zeroIndex == -1) {
            copyOfGarage.activeIndexes = [0];
        } else {
            copyOfGarage.activeIndexes = [-1];
        }

    } else {
        const zeroIndex = copyOfGarage.activeIndexes.findIndex(
            (element) => element === 0,
        );

        if (zeroIndex !== -1) {
            copyOfGarage.activeIndexes.splice(zeroIndex, 1);
        }

        const findIndex = copyOfGarage.activeIndexes.findIndex(
            (element) => element === index,
        );

        if (findIndex === -1) {
            copyOfGarage.activeIndexes.push(index);
        } else {
            copyOfGarage.activeIndexes.splice(findIndex, 1);
        }

        if (copyOfGarage.activeIndexes.length === 0) {
            copyOfGarage.activeIndexes = [-1];
        }
    }

    return copyOfGarage
};

const updateOpenHouse = (openHouse, index) => {

    const copyOfHouse = { ...openHouse };
    if (copyOfHouse.activeIndex == 0) {
        copyOfHouse.activeIndex = -1
    } else {
        copyOfHouse.activeIndex = index;
    }

    return copyOfHouse
};

const updateBasement = (basement, index) => {

    const copyOfBasement = { ...basement };
    if (copyOfBasement.activeIndex == 0) {
        copyOfBasement.activeIndex = -1
    } else {
        copyOfBasement.activeIndex = index;
    }
    return copyOfBasement
};

export { updateBedroom, updateBathroom, updateKitchen, updateGarage, updateOpenHouse, updateBasement }