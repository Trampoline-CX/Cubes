import {
  SvgAccounts,
  SvgMoney,
  SvgMore,
  SvgProfile,
  SvgSearch,
  SvgSignOut,
  SvgFingerprint,
  SvgClear,
  SvgBrokenConnection,
  SvgNotes,
  SvgNavigate,
  SvgSecurity,
  SvgCloseModal,
  SvgBackspace,
  SvgGoBack,
  SvgActionEdit,
  SvgCreditCard,
  SvgFaceId,
  SvgTheme,
  SvgActionAdd,
  SvgSuccess,
  SvgNavDisclosure,
  SvgDone,
  SvgFeedback,
  SvgVisibility,
  SvgVisibilityOff,
  SvgActionAddCircle,
  SvgRent,
  SvgPropertyDebt,
  SvgPreferences,
} from '../__generated__'

export const iconsMap = {
  accounts: SvgAccounts,
  money: SvgMoney,
  more: SvgMore,
  profile: SvgProfile,
  search: SvgSearch,
  'sign-out': SvgSignOut,
  fingerprint: SvgFingerprint,
  clear: SvgClear,
  'broken-connection': SvgBrokenConnection,
  note: SvgNotes,
  navigate: SvgNavigate,
  security: SvgSecurity,
  'close-modal': SvgCloseModal,
  backspace: SvgBackspace,
  'go-back': SvgGoBack,
  'action-edit': SvgActionEdit,
  'credit-card': SvgCreditCard,
  'face-id': SvgFaceId,
  theme: SvgTheme,
  'action-add': SvgActionAdd,
  'action-add-circle': SvgActionAddCircle,
  success: SvgSuccess,
  preferences: SvgPreferences,
  'property-debt': SvgPropertyDebt,
  rent: SvgRent,
  'nav-disclosure': SvgNavDisclosure,
  done: SvgDone,
  feedback: SvgFeedback,
  visibility: SvgVisibility,
  'visibility-off': SvgVisibilityOff,
}

export type IconName = Extract<keyof typeof iconsMap, string>
