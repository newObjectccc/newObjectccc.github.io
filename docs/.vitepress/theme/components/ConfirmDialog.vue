<script setup lang="ts">
import { answerConfirm, confirmState } from "../secret/confirm";
</script>

<template>
  <Teleport to="body">
    <div v-if="confirmState.visible" class="confirm-mask" @click.self="answerConfirm(false)">
      <div class="confirm-card" role="dialog" aria-modal="true">
        <p class="confirm-message">{{ confirmState.message }}</p>
        <div class="confirm-actions">
          <button v-if="confirmState.cancelText !== null" class="confirm-btn cancel" @click="answerConfirm(false)">
            {{ confirmState.cancelText }}
          </button>
          <button
            class="confirm-btn ok"
            :class="{ danger: confirmState.danger }"
            autofocus
            @click="answerConfirm(true)"
          >
            {{ confirmState.okText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(6, 9, 7, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.confirm-card {
  width: min(360px, 100%);
  padding: 28px 24px 20px;
  border-radius: 14px;
  background: rgba(16, 23, 16, 0.92);
  border: 1px solid rgba(92, 232, 160, 0.16);
  box-shadow: 0 0 50px rgba(61, 220, 132, 0.08), 0 20px 50px rgba(0, 0, 0, 0.5);
  font-family: "Noto Serif SC", "Songti SC", "STSong", serif;
}

.confirm-message {
  color: #eaf2e6;
  font-size: 0.98rem;
  line-height: 1.9;
  text-align: center;
  margin-bottom: 20px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
}

.confirm-btn {
  flex: 1;
  padding: 10px 0;
  font-size: 0.92rem;
  font-family: inherit;
  border-radius: 9px;
  cursor: pointer;
  border: 1px solid rgba(92, 232, 160, 0.25);
  transition: filter 0.2s;
}

.confirm-btn.cancel {
  background: transparent;
  color: #7f917c;
}

.confirm-btn.cancel:hover {
  color: #b6c7b1;
}

.confirm-btn.ok {
  background: linear-gradient(135deg, #5ce8a0, #2bb86c);
  color: #0b0f0c;
  font-weight: 600;
  border: none;
}

.confirm-btn.ok.danger {
  background: linear-gradient(135deg, #e8956b, #c2554f);
  color: #fff;
}

.confirm-btn.ok:hover {
  filter: brightness(1.1);
}
</style>
