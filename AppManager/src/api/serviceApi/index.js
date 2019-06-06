import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const getServices = storeId => {
    return callApi(Type.GET, Modal.SERVICE, `/services/store-${storeId}`)
}

export const getSampleServices = storeId => {
    return callApi(Type.GET, Modal.SERVICE, `/services/default-${storeId}`)
}

export const addServiceFromSampleService = (storeId, selectedService) => {
    return callApi(Type.CREATE, Modal.SERVICE, `/services/store-${storeId}`, 'POST', JSON.stringify(selectedService));
}

export const getModals = serviceId => {
    return callApi(Type.GET, Modal.SERVICE, `/designs/service-${serviceId}`)
}

export const getDetailModals = modalId => {
    return callApi(Type.GET_DETAIL, Modal.SERVICE, `/designs/${modalId}`)
}

export const addModal = (model) => {
    return callApi(Type.CREATE, Modal.SERVICE, `/designs`, 'POST', JSON.stringify(model))
}

export const updateModal = model => {
    return callApi(Type.UPDATE, Modal.SERVICE, `/designs/${model.id}`, 'PUT', JSON.stringify(model))
}

export const deleteModal = modelId => {
    return callApi(Type.DELETE, Modal.SERVICE, `/design/${modelId}`, 'DELETE')
}

export const getYourService = storeId => {
    return callApi(Type.GET, Modal.SERVICE, 'api/store/service-bystore/1')
}

export const addCustomService = service => {
    return callApi(Type.CREATE, Modal.SERVICE, `/services`, 'POST', JSON.stringify(service))
}

export const updateService = service => {
    return callApi(Type.UPDATE, Modal.SERVICE, `/services/${service.id}`, 'PUT', JSON.stringify(service))
}

export const deleteService = serviceId => {
    return callApi(Type.DELETE, Modal.SERVICE, `/services/${serviceId}`, 'DELETE')
}