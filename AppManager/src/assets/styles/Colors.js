const tintColor = '#007894'; //'#001e4c';
const iconColor = tintColor;
const light = '#fff';
const lightPlus = '#FAFAFA';
const tintColorLight = '#F0F8FE';
const tintColorMedium = '#00A3BB'; //'#006ece';
const dark1 = '#000'; //best dark
const dark9 = '#3B3B3B'; //used
const bestBlur = 'rgba(79, 79, 79, .1)';
const darkBlur = 'rgba(79, 79, 79, .5)';
const blackBlur = 'rgba(0, 0, 0, .5)';
const lightBlur = 'rgba(255,255,255,.5)';
const blueBlur = 'rgba(47, 135, 171, .5)';
const transparent = 'transparent';
const primaryColor = '#007bff'; //blue
const successColor = '#28a745';
const warningColor = '#ffc107';
const dangerColor = '#dc3545';
const darkGreyColor = '#343a40';
const secondaryColor = '#6c757d';
const lightGreyColor = '#f8f9fa';

const primaryButton = tintColorMedium;

const bg = light;
const functionColorLight = tintColorMedium;
const functionColorDark = tintColor;
const darkText = dark9;
const lightText = light;
const lightBg = light;

export default {
  primaryColor,
  successColor,
  warningColor,
  secondaryColor,
  dangerColor,
  darkGreyColor,
  lightGreyColor,
  primaryButton,
  lightPlus,
  lightBlur,
  blueBlur,
  dark1,
  dark9,
  bg,
  darkBlur,
  bestBlur,
  transparent,
  blackBlur,
  // tintColorLight,
  // tintColorMedium,
  tabIconDefault: 'rgba(45, 92, 129, .5)',
  tabIconSelected: iconColor,
  tabBar: '#fff',
  errorBackground: 'red',
  errorText: 'red',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  functionColorLight,
  functionColorDark,
  darkText,
  lightText,
  lightBg
};

export const basic = {
  header: bg,
  footer: bg,
  body: bg,
  gradientButton: [functionColorDark, '#2F87AB', functionColorLight],
  icon: functionColorDark,
}