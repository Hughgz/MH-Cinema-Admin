import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, editMovie } from "reduxHilo/actions/movieAction";
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
import PropTypes from "prop-types";
import axios from "axios";
import ModalAlert from "components/alert/modalAlert";

const EditMovieForm = ({ isOpen, onClose, movieId, fetchMovies }) => {
  const dispatch = useDispatch();
  const movie = useSelector((state) =>
    state.movie.movies.find((m) => m.id === movieId)
  );

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    releaseDate: "",
    rated: "",
    country: "",
    director: "",
    shortDescription: "",
    longDescription: "",
    trailerURL: "",
    categories: "",
    actors: "",
    showing: "",
    smallImgMovie: null,
    largeImgMovie: null,
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [currentSmallImage, setCurrentSmallImage] = useState(null);
  const [currentLargeImage, setCurrentLargeImage] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    if (movie) {
      setFormData({ ...movie, releaseDate: movie.releaseDate.toString().slice(0, 10) }); // Chuyển đổi ngày
      if (movie.smallImgMovie) {
        setCurrentSmallImage(movie.smallImgMovie);
      }
      if (movie.largeImgMovie) {
        setCurrentLargeImage(movie.largeImgMovie);
      }
    } else {
      dispatch(fetchMovieDetails(movieId));
    }
  }, [movie, movieId, dispatch]);

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

    if (!formData.name) {
      validationErrors.name = "Title is required";
    }
    if (!formData.duration || isNaN(formData.duration) || formData.duration <= 0) {
      validationErrors.duration = "Duration must be a positive number";
    }
    if (!formData.releaseDate) {
      validationErrors.releaseDate = "Released date is required";
    }
    if (!formData.rated || isNaN(formData.rated) || formData.rated < 0 || formData.rated > 10) {
      validationErrors.rated = "Rated must be between 0 and 10";
    }
    if (!formData.country) {
      validationErrors.country = "Country is required";
    }
    if (!formData.director) {
      validationErrors.director = "Director is required";
    }
    if (!formData.shortDescription) {
      validationErrors.shortDescription = "Short Description is required";
    }
    if (!formData.longDescription) {
      validationErrors.longDescription = "Long Description is required";
    }
    if (!formData.trailerURL) {
      validationErrors.trailerURL = "Trailer URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.trailerURL)) {
      validationErrors.trailerURL = "Trailer URL must be a valid URL";
    }
    if (!formData.showing) {
      validationErrors.showing = "Status is required";
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
      if (name === "smallImgMovie") {
        setCurrentSmallImage(URL.createObjectURL(files[0]));
      } else if (name === "largeImgMovie") {
        setCurrentLargeImage(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        });

        await dispatch(editMovie(movieId, formDataToSend));

        setAlertMessage("Movie updated successfully");
        setAlertType("success");
        setShowAlert(true);

        onClose();
        dispatch(fetchMovies());
      } catch (error) {
        console.error("Error updating movie:", error.response ? error.response.data : error.message);
        setAlertMessage("Failed to update the movie. Please try again.");
        setAlertType("error");
        setShowAlert(true);
      }
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const formBackgroundColor = useColorModeValue("white", "gray.700");
  const inputBackgroundColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("black", "white");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Movie</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="name" isInvalid={errors.name}>
                  <FormLabel color={textColor}>Title</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                </FormControl>
                <FormControl id="duration" isInvalid={errors.duration}>
                  <FormLabel color={textColor}>Duration (minutes)</FormLabel>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.duration && <FormErrorMessage>{errors.duration}</FormErrorMessage>}
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
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.releaseDate && <FormErrorMessage>{errors.releaseDate}</FormErrorMessage>}
                </FormControl>
                <FormControl id="rated" isInvalid={errors.rated}>
                  <FormLabel color={textColor}>Rating (0-10)</FormLabel>
                  <Input
                    type="number"
                    name="rated"
                    value={formData.rated}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="10"
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.rated && <FormErrorMessage>{errors.rated}</FormErrorMessage>}
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
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.director && <FormErrorMessage>{errors.director}</FormErrorMessage>}
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
                    _placeholder={{ color: "gray.500" }}
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
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.longDescription && <FormErrorMessage>{errors.longDescription}</FormErrorMessage>}
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
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.trailerURL && <FormErrorMessage>{errors.trailerURL}</FormErrorMessage>}
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
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.categories && <FormErrorMessage>{errors.categories}</FormErrorMessage>}
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
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.actors && <FormErrorMessage>{errors.actors}</FormErrorMessage>}
                </FormControl>
                <FormControl id="showing" isInvalid={errors.showing}>
                  <FormLabel color={textColor}>Status</FormLabel>
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
                <FormControl id="smallImgMovie">
                  <FormLabel color={textColor}>Small Image</FormLabel>
                  {currentSmallImage && <img src={currentSmallImage} alt="Current Small Image" style={{ marginBottom: '10px', maxWidth: '200px' }} />}
                  <Input
                    type="file"
                    name="smallImgMovie"
                    accept="image/*"
                    onChange={handleFileChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  />
                </FormControl>
                <FormControl id="largeImgMovie">
                  <FormLabel color={textColor}>Large Image</FormLabel>
                  {currentLargeImage && <img src={currentLargeImage} alt="Current Large Image" style={{ marginBottom: '10px', maxWidth: '200px' }} />}
                  <Input
                    type="file"
                    name="largeImgMovie"
                    accept="image/*"
                    onChange={handleFileChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  />
                </FormControl>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalAlert
        isVisible={showAlert}
        message={alertMessage}
        type={alertType}
        onClose={handleCloseAlert}
      />
    </>
  );
};

EditMovieForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movieId: PropTypes.string.isRequired,
  fetchMovies: PropTypes.func.isRequired,
};

export default EditMovieForm;
