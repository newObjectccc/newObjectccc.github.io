import { reactive } from "vue";

/**
 * 主题化确认/提示对话框（替代浏览器原生 confirm/alert）。
 * 用法：const ok = await askConfirm("确定吗？") / await askAlert("已处理")
 */

interface ConfirmState {
  visible: boolean;
  message: string;
  okText: string;
  cancelText: string | null; // null = 纯提示（无取消按钮）
  danger: boolean;
  resolve: ((v: boolean) => void) | null;
}

export const confirmState = reactive<ConfirmState>({
  visible: false,
  message: "",
  okText: "确定",
  cancelText: "取消",
  danger: false,
  resolve: null,
});

function open(message: string, opts: { okText?: string; danger?: boolean; alert?: boolean } = {}) {
  return new Promise<boolean>((resolve) => {
    confirmState.message = message;
    confirmState.okText = opts.okText || "确定";
    confirmState.cancelText = opts.alert ? null : "取消";
    confirmState.danger = !!opts.danger;
    confirmState.resolve = resolve;
    confirmState.visible = true;
  });
}

export const askConfirm = (message: string, opts?: { okText?: string; danger?: boolean }) =>
  open(message, opts);

export const askAlert = (message: string) => open(message, { alert: true, okText: "好的" });

export function answerConfirm(v: boolean) {
  confirmState.visible = false;
  confirmState.resolve?.(v);
  confirmState.resolve = null;
}
