import { useState } from "react";
import { LoadingOverlay, createStyles, rem } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import { useForm } from "@mantine/form";
import { useCreateEventMutation } from "../features/events/eventSlice";
import { useNavigate } from "react-router-dom";
import { useFetchSavedLocationsQuery } from "../features/events/savedLocationsApi";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import Navbar from "../features/navbar/NavBar";
import CreateEventView from "../features/events/CreateEventView";



const CreateEventPage = () => {
  const navigate = useNavigate();

  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [createEvent, { isLoading, error }] = useCreateEventMutation();

  const {
    data: savedLocationsData = [],
    isLoading: savedLocationsLoading,
    refetch,
  } = useFetchSavedLocationsQuery();

  const [opened, { open, close }] = useDisclosure(false);
  const [bannerFile, setBannerFile] = useState(null);
  const currentUser = useSelector(selectUser);

  const useStyles = createStyles((_) => ({
    newEventText: {
      marginTop: rem(100),
      fontSize: rem(40),
      fontFamily: "Roboto",
    },
    input: {
      marginTop: rem(10),
    },
  }));

  const { classes, theme } = useStyles();
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      showNumberOfGuests: false,
      location: {},
      useClicker: false,
      showEventBusyness: false,
      publicEvent: false,
      termsOfService: false,
    },

    validate: {
      // Name regex longer than 2 characters but shorter than 30
      name: (value) => (/^.{2,30}$/.test(value) ? null : "Invalid name"),
      // Description regex no longer than 150 characters
      description: (value) =>
        /^.{0,1000}$/.test(value) ? null : "Invalid description",
      // Event start date cannot be in the past
      startDateTime: (value) => (value > new Date() ? null : "Invalid date"),
      endDateTime: (value, values) =>
        value > values.startDateTime ? null : "invalid end date",
      termsOfService: (value) => (value ? null : "You must agree to the terms"),
      location: (value) => {
        if (value === null || value === undefined) {
          return "You must select a location";
        }
        return null;
      },
    },
  });

  const submitForm = async (values) => {
    const location = savedLocationsData.filter(
      (loc) => loc.id === values.location
    );

    if (location.length === 0) {
      notifications.show({
        title: "Error",
        message: "Please select a location",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    values.location = {
      ...location[0],
      capacity: location[0].capacity, // Add the capacity to the event values
    };

    values.location = location[0];
    values.banner = bannerFile;
    values.owner = currentUser.uid;


    await createEvent(values);
    navigate("/");
  };

  if (savedLocationsLoading) {
    return <LoadingOverlay visible={savedLocationsLoading} overlayBlur={2} />;
  }

  const formErrorNotification = (validationErros, values, event) => {
    notifications.show({
      title: "Error",
      message: "Please fill in all required fields",
      color: "red",
      icon: <IconX />,
    });
  };

  const handleBannerFileChange = (image) => {
    setBannerFile(image);
  };

  return (
    <>
      <Navbar />
      <CreateEventView isLoading={isLoading} submitForm={submitForm} formErrorNotification={formErrorNotification} classes={classes} active={active} handleBannerFileChange={handleBannerFileChange} form={form} savedLocationsData={savedLocationsData} opened={opened} open={open} close={close} prevStep={prevStep} nextStep={nextStep} />
    </>
  );
};
export default CreateEventPage;
