import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

type TTargetInView = 'connectWallet' | 'register' | 'forgotPassword' | 'login' | 'updatePassword' | '';

export type IModalStore = {
  targetInView: TTargetInView;
  resetPasswordToken: string;
  // eslint-disable-next-line no-unused-vars
  setTargetInView: (target: TTargetInView) => void;
  // eslint-disable-next-line no-unused-vars
  setResetPasswordToken: (target: string) => void;
};

const useBaseIntersectionStore = create<IModalStore>((set) => ({
  targetInView: '',
  resetPasswordToken: '',
  setResetPasswordToken: (target) =>
    set(() => ({
      resetPasswordToken: target,
    })),
  setTargetInView: (target) =>
    set(() => ({
      targetInView: target,
    })),
}));

export const useIntersectionStore = createSelectorFunctions(useBaseIntersectionStore);
