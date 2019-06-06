import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const getStatiticByTotal = data => {
    return callApi(Type.GET_DETAIL, Modal.STATISTIC, `/statistics/total-revenue`, 'POST',
        JSON.stringify(data)
    )
}

export const getStatiticByCompare = data => {
    return callApi(Type.GET_DETAIL, Modal.STATISTIC, `/statistics/compare-revenue`, 'POST',
        JSON.stringify(data)
    )
}

export const getStatiticByEmployee = data => {
    return callApi(Type.GET_DETAIL, Modal.STATISTIC, `/statistics/employee`, 'POST',
        JSON.stringify(data)
    )
}

export const getStatiticByService = data => {
    return callApi(Type.GET_DETAIL, Modal.STATISTIC, `/statistics/service`, 'POST',
        JSON.stringify(data)
    )
}

export const getStatiticByTotalOfEmployee = (id, type) => {
    return callApi(Type.GET_DETAIL, Modal.STATISTIC, `/statistics/total-revenue/employee/${id}`, 'POST',
        JSON.stringify(type))
}

export const getStatiticByServiceOfEmployee = (id, type) => {
    return callApi(Type.GET_DETAIL, Modal.STATISTIC, `/statistics/service/employee/${id}`, 'POST',
        JSON.stringify(type))
}

