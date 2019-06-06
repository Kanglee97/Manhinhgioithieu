//// Type
const GET = 'Lấy danh sách'
const GET_DETAIL = 'Lấy thông tin'
const CREATE = 'Tạo'
const UPDATE = 'Cập nhập'
const DELETE = 'Xoá'
const SIGN_IN = 'Đăng nhập'
const SIGN_OUT = 'Đăng xuất'
const FIND = 'Tìm kiếm'

const Type = {
    GET,
    GET_DETAIL,
    CREATE,
    UPDATE,
    DELETE,
    SIGN_IN,
    SIGN_OUT,
    FIND
}

//// Modal
const PACKAGE = 'Gói'
const CURRENT_PACKAGE = 'Gói hiện tại'
const ACCOUNT = 'Tài khoản'
const BOOKING = 'Lịch hẹn'
const DISCOUNT = 'Khuyến mãi'
const CUSTOMER = 'Khách hàng'
const EMPLOYEE = 'Nhân viên'
const MESSAGE = 'Tin nhắn '
const OPTION = 'Tuỳ chọn'
const SERVICE = 'Dịch vụ'
const ORDER = 'Đơn hàng'
const STATISTIC = 'Thống kê'
const STORE = 'Cửa hàng'
const DEVICE = 'Thiết bị'
const NOTIFICATION = 'Notification'

const Modal = {
    PACKAGE,
    ACCOUNT,
    BOOKING,
    DISCOUNT,
    CUSTOMER,
    EMPLOYEE,
    MESSAGE,
    OPTION,
    SERVICE,
    ORDER,
    STATISTIC,
    STORE,
    DEVICE,
    NOTIFICATION
}

const COVER = 'https://firebasestorage.googleapis.com/v0/b/salozo.appspot.com/o/DefaultImages%2Fsalon-thumb-2.jpg?alt=media&token=5c84ceef-7bac-420f-91a9-8ae2917aac63';
const AVATAR = 'https://firebasestorage.googleapis.com/v0/b/salozo.appspot.com/o/DefaultImages%2Fdefault-avatar-blue.png?alt=media&token=035ef6ed-6339-4aeb-92a2-8f0350149ad4';

const DefaultImages = {
    COVER,
    AVATAR
}

export {
    Type,
    Modal,
    DefaultImages
} 