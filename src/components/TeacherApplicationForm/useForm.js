import { useState } from "react";

export const useForm = () => {
  const [inputs, setInputs] = useState({
    institution: "",
    credential: "",
    yearOfPassing: "",
    state: "",
    city: "",
    country: "",
    zipCode: "",
    subject: "",
    workInstitution: "",
    subjectTaught: "",
    experience: "",
    role: "",
    startDate: "",
    endDate: "",
    classSize: "",
    ageRangeFrom: "",
    ageRangeTo: "",
    workAddress1: "",
    workAddress2: "",
    workState: "",
    workCity: "",
    WorkZipCode: "",
    workCountry: "",
    workInsWebsite: "",
    ownsites: "",
    facebook: "",
    linkedIn: "",
  });
  const change = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    change,
    inputs,
  };
};
