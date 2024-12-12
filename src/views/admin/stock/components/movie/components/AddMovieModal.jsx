import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Button,
    useColorModeValue,
    FormErrorMessage,
    Stack,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { addMovie, fetchMovies } from "reduxHilo/actions/movieAction";
import ModalAlert from "components/alert/modalAlert";

const CreateMovieModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        shortDescription: "",
        longDescription: "",
        director: "",
        actors: "",
        categories: "",
        releaseDate: "",
        duration: "",
        trailerURL: "",
        country: "",
        rated: "",
        showing: ""
    });

    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [isAlertVisible, setIsAlertVisible] = useState(false); 
    const [alertMessage, setAlertMessage] = useState(""); 

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all");
                const countryOptions = response.data
                    .map((country) => ({
                        value: country.cca2,
                        label: country.name.common,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setCountries(countryOptions);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

    const validate = () => {
        let validationErrors = {};

        if (!formData.name) validationErrors.name = "Title is required";
        if (!formData.duration || isNaN(formData.duration) || formData.duration <= 0) 
            validationErrors.duration = "Duration must be a positive number";
        if (!formData.releaseDate) validationErrors.releaseDate = "Release date is required";
        if (!formData.rated) validationErrors.rated = "Rated is required";
        if (!formData.country) validationErrors.country = "Country is required";
        if (!formData.director) validationErrors.director = "Director is required";
        if (!formData.shortDescription) validationErrors.shortDescription = "Short description is required";
        if (!formData.longDescription) validationErrors.longDescription = "Long description is required";
        if (!formData.showing) validationErrors.showing = "Showing status is required";
        if (!formData.trailerURL) validationErrors.trailerURL = "Trailer URL is required";
        else if (!/^https?:\/\/.+/.test(formData.trailerURL)) validationErrors.trailerURL = "Trailer URL must be a valid URL";

        return validationErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                const data = new FormData();
                Object.keys(formData).forEach((key) => {
                    if (formData[key]) data.append(key, formData[key]);
                });

                await dispatch(addMovie(data)); 
                setAlertMessage("Movie added successfully!");
                setIsAlertVisible(true); 
                onClose(); 
                dispatch(fetchMovies()); 
            } catch (error) {
                console.error("Error saving movie:", error.response ? error.response.data : error.message);
            }
        }
    };
    const inputBackgroundColor = useColorModeValue("gray.100", "gray.600");
    const textColor = useColorModeValue("black", "white");

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Movie</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="name" isInvalid={errors.name}>
                                    <FormLabel color={textColor}>Movie Name</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="shortDescription" isInvalid={errors.shortDescription}>
                                    <FormLabel color={textColor}>Short Description</FormLabel>
                                    <Textarea
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.shortDescription && <FormErrorMessage>{errors.shortDescription}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="longDescription" isInvalid={errors.longDescription}>
                                    <FormLabel color={textColor}>Long Description</FormLabel>
                                    <Textarea
                                        name="longDescription"
                                        value={formData.longDescription}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.longDescription && <FormErrorMessage>{errors.longDescription}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="director" isInvalid={errors.director}>
                                    <FormLabel color={textColor}>Director</FormLabel>
                                    <Input
                                        type="text"
                                        name="director"
                                        value={formData.director}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.director && <FormErrorMessage>{errors.director}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="actors" isInvalid={errors.actors}>
                                    <FormLabel color={textColor}>Actors</FormLabel>
                                    <Input
                                        type="text"
                                        name="actors"
                                        value={formData.actors}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.actors && <FormErrorMessage>{errors.actors}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="categories" isInvalid={errors.categories}>
                                    <FormLabel color={textColor}>Categories</FormLabel>
                                    <Input
                                        type="text"
                                        name="categories"
                                        value={formData.categories}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.categories && <FormErrorMessage>{errors.categories}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="releaseDate" isInvalid={errors.releaseDate}>
                                    <FormLabel color={textColor}>Release Date</FormLabel>
                                    <Input
                                        type="date"
                                        name="releaseDate"
                                        value={formData.releaseDate}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.releaseDate && <FormErrorMessage>{errors.releaseDate}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="duration" isInvalid={errors.duration}>
                                    <FormLabel color={textColor}>Duration (in minutes)</FormLabel>
                                    <Input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.duration && <FormErrorMessage>{errors.duration}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="trailerURL" isInvalid={errors.trailerURL}>
                                    <FormLabel color={textColor}>Trailer URL</FormLabel>
                                    <Input
                                        type="url"
                                        name="trailerURL"
                                        value={formData.trailerURL}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.trailerURL && <FormErrorMessage>{errors.trailerURL}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="country" isInvalid={errors.country}>
                                    <FormLabel color={textColor}>Country</FormLabel>
                                    <Select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    >
                                        {countries.map((country) => (
                                            <option key={country.value} value={country.value}>
                                                {country.label}
                                            </option>
                                        ))}
                                    </Select>
                                    {errors.country && <FormErrorMessage>{errors.country}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="rated" isInvalid={errors.rated}>
                                    <FormLabel color={textColor}>Rated</FormLabel>
                                    <Input
                                        type="text"
                                        name="rated"
                                        value={formData.rated}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.rated && <FormErrorMessage>{errors.rated}</FormErrorMessage>}
                                </FormControl>

                                <FormControl id="showing" isInvalid={errors.showing}>
                                    <FormLabel color={textColor}>Showing</FormLabel>
                                    <Select
                                        name="showing"
                                        value={formData.showing}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    >
                                        <option value="1">Showing</option>
                                        <option value="0">Not Showing</option>
                                    </Select>
                                    {errors.showing && <FormErrorMessage>{errors.showing}</FormErrorMessage>}
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>Save</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ModalAlert
                isVisible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
                message={alertMessage}
            />
        </>
    );
};

CreateMovieModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateMovieModal;
