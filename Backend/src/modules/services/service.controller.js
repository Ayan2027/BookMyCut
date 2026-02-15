import Service from "./service.model.js";

/* Create service */
export const createService = async (req, res) => {
  const service = await Service.create({
    salon: req.salon._id,
    ...req.body
  });

  res.json(service);
};

/* Get own services */
export const getMyServices = async (req, res) => {
  const services = await Service.find({ salon: req.salon._id });
  res.json(services);
};

/* Update service */
export const updateService = async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.serviceId, salon: req.salon._id },
    req.body,
    { new: true }
  );

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json(service);
};

/* Delete service */
export const deleteService = async (req, res) => {
  const result = await Service.findOneAndDelete({
    _id: req.params.serviceId,
    salon: req.salon._id
  });

  if (!result) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json({ message: "Service deleted" });
};


/* Public: get services by salon */
export const getServicesBySalon = async (req, res) => {
  try {
    const { salonId } = req.params;

    const services = await Service.find({ salon: salonId });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
