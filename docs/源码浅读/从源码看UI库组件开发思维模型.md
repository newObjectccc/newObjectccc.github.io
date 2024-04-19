# **【偷裤衩】Dan佬的Redux**😎

👉 引言：```这是一个源码共读的系列文章，我管它叫偷裤衩，顾名思义，非常形象，妙不可言，不可多言，回味无穷。```

1. *简单聊一下【偷裤衩】的价值：*

- **促进深入理解**: 通过集体讨论和分享经验，加深对源码的理解
- **提高编码技巧**: 学习他人的开发思路和技巧，拓宽自己的思维方式，是真的可以学到很多骚操作
- **互相学习阅读源码技巧**: 阅读源码本身也是需要一定技巧的，和经验的。
- **可能给开源社区贡献代码**: 当你阅读完源码，或途中的一些问题，可以给开源社区提issue，甚至是PR，若被维护者Merged，那你便成为了开源社区贡献者。

2. *简单聊一下【偷裤衩】的步骤：*

- **选择源码**: 选择一个对自己有价值或感兴趣的开源项目
- **分析源码结构**: 理解项目的整体架构、模块划分及依赖关系
- **解读核心代码**: 深入研究关键的核心代码实现，阅读和理解源码注释

--------------------

组件库源码一般不会很深，所以并不会花时间去解读逻辑细节，若有兴趣可以自行观看，而本文只会关注以下的点。

- 各UI框架共性
- 组件开发思维图块（这里不讨论需遵循的开发规范或设计原则或设计模式，如**BEM**、**S.O.L.I.D**等）

--------------------

### 开始🚀

- [TDesign](https://github.com/Tencent) 腾讯开源UI库

组件目录结构如下图：

图1

```tsx:line-numbers
const Button = forwardRef((originProps: ButtonProps, ref: React.RefObject<HTMLElement>) => {
  const props = useDefaultProps(originProps, buttonDefaultProps);
  const {
    type,
    theme,
    variant,
    icon,
    disabled,
    loading,
    size,
    block,
    ghost,
    shape,
    children,
    content,
    className,
    suffix,
    href,
    tag,
    onClick,
    ...buttonProps
  } = props;

  const { classPrefix } = useConfig();  // [!code focus]

  const [btnDom, setRefCurrent] = useDomRefCallback();  // [!code focus]
  useRipple(ref?.current || btnDom);  // [!code focus]

  const renderChildren = content ?? children;  // [!code focus]

  let iconNode = icon;  // [!code focus]
  if (loading) iconNode = <Loading loading={loading} inheritColor={true} />;  // [!code focus]

  const renderTheme = useMemo(() => {  // [!code focus]
    if (!theme) {  // [!code focus]
      if (variant === 'base') return 'primary';  // [!code focus]
      return 'default';  // [!code focus]
    }  // [!code focus]
    return theme;  // [!code focus]
  }, [theme, variant]);  // [!code focus]

  const renderTag = useMemo(() => {  // [!code focus]
    if (!tag && href && !disabled) return 'a';  // [!code focus]
    if (!tag && disabled) return 'div';  // [!code focus]
    return tag || 'button';  // [!code focus]
  }, [tag, href, disabled]);  // [!code focus]

  return React.createElement(  // [!code focus]
    renderTag,  // [!code focus]
    {  // [!code focus]
      ...buttonProps,  // [!code focus]
      href,  // [!code focus]
      type,  // [!code focus]
      ref: ref || setRefCurrent,  // [!code focus]
      disabled: disabled || loading,  // [!code focus]
      className: classNames(  // [!code focus]
        className,  // [!code focus]
        [  // [!code focus]
          `${classPrefix}-button`,  // [!code focus]
          `${classPrefix}-button--theme-${renderTheme}`,  // [!code focus]
          `${classPrefix}-button--variant-${variant}`,  // [!code focus]
        ],  // [!code focus]
        {  // [!code focus]
          [`${classPrefix}-button--shape-${shape}`]: shape !== 'rectangle',  // [!code focus]
          [`${classPrefix}-button--ghost`]: ghost,  // [!code focus]
          [`${classPrefix}-is-loading`]: loading,  // [!code focus]
          [`${classPrefix}-is-disabled`]: disabled,  // [!code focus]
          [`${classPrefix}-size-s`]: size === 'small',  // [!code focus]
          [`${classPrefix}-size-l`]: size === 'large',  // [!code focus]
          [`${classPrefix}-size-full-width`]: block,  // [!code focus]
        },  // [!code focus]
      ),  // [!code focus]
      onClick: !disabled && !loading ? onClick : undefined,  // [!code focus]
    },  // [!code focus]
    <>  // [!code focus]
      {iconNode}  // [!code focus]
      {renderChildren && <span className={`${classPrefix}-button__text`}>{renderChildren}</span>}  // [!code focus]
      {suffix && <span className={`${classPrefix}-button__suffix`}>{parseTNode(suffix)}</span>}  // [!code focus]
    </>,  // [!code focus]
  );  // [!code focus]
});  // [!code focus]

Button.displayName = 'Button';  // [!code focus]

export default Button;
```

::: details 点我查看结构解读🔝
因为我们只看代码组织形式从而得出开发思维模型，所以不会探究更多逻辑细节。

1. 从目录上我们可以看到一个组件开发需要涉及到的一些非代码层面的东西，**测试用例**，**使用示例**，**样式脚本**，**默认参数**，**组件代码**，**说明文档**，**类型导出**，**组件代码**。
2. 从组件代码中我们可以看到一个组件需要包括的代码层面的东西，**Props传值**，**国际化**，**默认图标及样式**，**主题处理**，**渲染逻辑处理**，**方便调试的处理**，**暴露内部属性或方法**，**事件处理**，**性能优化**。
:::

--------------------

- [Element-plus](https://github.com/element-plus) 饿了么团队开源UI库

组件目录如下：

图2

```vue:line-numbers
<template>  // [!code focus]
  <component  // [!code focus]
    :is="tag"  // [!code focus]
    ref="_ref"  // [!code focus]
    v-bind="_props"  // [!code focus]
    :class="buttonKls"  // [!code focus]
    :style="buttonStyle"  // [!code focus]
    @click="handleClick"  // [!code focus]
  >  // [!code focus]
    <template v-if="loading">  // [!code focus]
      <slot v-if="$slots.loading" name="loading" />  // [!code focus]
      <el-icon v-else :class="ns.is('loading')">  // [!code focus]
        <component :is="loadingIcon" />  // [!code focus]
      </el-icon>  // [!code focus]
    </template>  // [!code focus]
    <el-icon v-else-if="icon || $slots.icon">  // [!code focus]
      <component :is="icon" v-if="icon" />  // [!code focus]
      <slot v-else name="icon" />  // [!code focus]
    </el-icon>  // [!code focus]
    <span  // [!code focus]
      v-if="$slots.default"  // [!code focus]
      :class="{ [ns.em('text', 'expand')]: shouldAddSpace }"  // [!code focus]
    >  // [!code focus]
      <slot />  // [!code focus]
    </span>  // [!code focus]
  </component>  // [!code focus]
</template>  // [!code focus]

<script lang="ts" setup>
import { computed } from 'vue'
import { ElIcon } from '@element-plus/components/icon'
import { useNamespace } from '@element-plus/hooks'
import { useButton } from './use-button'
import { buttonEmits, buttonProps } from './button'
import { useButtonCustomStyle } from './button-custom'

defineOptions({  // [!code focus]
  name: 'ElButton',  // [!code focus]
})  // [!code focus]

const props = defineProps(buttonProps)  // [!code focus]
const emit = defineEmits(buttonEmits)  // [!code focus]

const buttonStyle = useButtonCustomStyle(props)  // [!code focus]
const ns = useNamespace('button')  // [!code focus]
const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } =
  useButton(props, emit)  // [!code focus]
const buttonKls = computed(() => [  // [!code focus]
  ns.b(),  // [!code focus]
  ns.m(_type.value),  // [!code focus]
  ns.m(_size.value),  // [!code focus]
  ns.is('disabled', _disabled.value),  // [!code focus]
  ns.is('loading', props.loading),  // [!code focus]
  ns.is('plain', props.plain),  // [!code focus]
  ns.is('round', props.round),  // [!code focus]
  ns.is('circle', props.circle),  // [!code focus]
  ns.is('text', props.text),  // [!code focus]
  ns.is('link', props.link),  // [!code focus]
  ns.is('has-bg', props.bg),  // [!code focus]
])  // [!code focus]

defineExpose({  // [!code focus]
  /** @description button html element */
  ref: _ref,  // [!code focus]
  /** @description button size */
  size: _size,  // [!code focus]
  /** @description button type */
  type: _type,  // [!code focus]
  /** @description button disabled */
  disabled: _disabled,  // [!code focus]
  /** @description whether adding space */
  shouldAddSpace,  // [!code focus]
})  // [!code focus]
</script>  // [!code focus]

```

::: details 点我查看结构解读🔝

1. 从目录上我们可以看到一个组件开发需要涉及到的一些非代码层面的东西，**测试用例**，**样式脚本**，**默认参数**，**类型导出**，**组件代码**。
2. 从组件代码中我们可以看到一个组件需要包括的代码层面的东西，**Props传值**，**国际化**，**默认图标**，**默认样式处理**，**主题处理**，**渲染逻辑处理**，**方便调试的处理**，**暴露内部属性或方法**，**命名空间**，**事件处理**。
:::

--------------------

- [radix-ui](https://github.com/radix-vue) 国外开源社区UI库

组件目录结构如下：

图3

```vue:line-numbers
<script lang="ts">
import type { PrimitiveProps } from '@/Primitive'
import type { Ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { createContext, useFormControl, useForwardExpose } from '@/shared'
import type { CheckedState } from './utils'

export interface CheckboxRootProps extends PrimitiveProps {
  /** The checked state of the checkbox when it is initially rendered. Use when you do not need to control its checked state. */
  defaultChecked?: boolean
  /** The controlled checked state of the checkbox. Can be binded with v-model. */
  checked?: boolean | 'indeterminate'
  /** When `true`, prevents the user from interacting with the checkbox */
  disabled?: boolean
  /** When `true`, indicates that the user must check the checkbox before the owning form can be submitted. */
  required?: boolean
  /** The name of the checkbox. Submitted with its owning form as part of a name/value pair. */
  name?: string
  /** The value given as data when submitted with a `name`.
   *  @defaultValue "on"
   */
  value?: string
  /** Id of the element */
  id?: string
}

export type CheckboxRootEmits = {
  /** Event handler called when the checked state of the checkbox changes. */
  'update:checked': [value: boolean]
}

interface CheckboxRootContext {
  disabled: Ref<boolean>
  state: Ref<CheckedState>
}

export const [injectCheckboxRootContext, provideCheckboxRootContext]
  = createContext<CheckboxRootContext>('CheckboxRoot')
</script>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { Primitive } from '@/Primitive'
import { getState, isIndeterminate } from './utils'

defineOptions({  // [!code focus]
  inheritAttrs: false,  // [!code focus]
})  // [!code focus]

const props = withDefaults(defineProps<CheckboxRootProps>(), {  // [!code focus]
  checked: undefined,  // [!code focus]
  value: 'on',  // [!code focus]
  as: 'button',  // [!code focus]
})  // [!code focus]
const emits = defineEmits<CheckboxRootEmits>()  // [!code focus]
const { disabled } = toRefs(props)  // [!code focus]

const checked = useVModel(props, 'checked', emits, {  // [!code focus]
  defaultValue: props.defaultChecked,  // [!code focus]
  passive: (props.checked === undefined) as false,  // [!code focus]
}) as Ref<CheckedState>  // [!code focus]

const { forwardRef, currentElement } = useForwardExpose()  // [!code focus]
const isFormControl = useFormControl(currentElement)  // [!code focus]
const ariaLabel = computed(() => props.id && currentElement.value  // [!code focus]
  ? (document.querySelector(`[for="${props.id}"]`) as HTMLLabelElement)?.innerText  // [!code focus]
  : undefined)  // [!code focus]

provideCheckboxRootContext({  // [!code focus]
  disabled,  // [!code focus]
  state: checked,  // [!code focus]
})  // [!code focus]
</script>  // [!code focus]

<template>  // [!code focus]
  <Primitive  // [!code focus]
    v-bind="$attrs"  // [!code focus]
    :id="id"  // [!code focus]
    :ref="forwardRef"  // [!code focus]
    role="checkbox"  // [!code focus]
    :as-child="props.asChild"  // [!code focus]
    :as="as"  // [!code focus]
    :type="as === 'button' ? 'button' : undefined"  // [!code focus]
    :aria-checked="isIndeterminate(checked) ? 'mixed' : checked"  // [!code focus]
    :aria-required="false"  // [!code focus]
    :aria-label="$attrs['aria-label'] || ariaLabel"  // [!code focus]
    :data-state="getState(checked)"  // [!code focus]
    :data-disabled="disabled ? '' : undefined"  // [!code focus]
    :disabled="disabled"  // [!code focus]
    @keydown.enter.prevent="() => {
      // According to WAI ARIA, Checkboxes don't activate on enter keypress
    }"  // [!code focus]
    @click="checked = isIndeterminate(checked) ? true : !checked"  // [!code focus]
  >  // [!code focus]
    <slot />  // [!code focus]
  </Primitive>  // [!code focus]

  <input  // [!code focus]
    v-if="isFormControl"  // [!code focus]
    type="checkbox"  // [!code focus]
    tabindex="-1"  // [!code focus]
    aria-hidden  // [!code focus]
    :value="value"  // [!code focus]
    :checked="!!checked"  // [!code focus]
    :name="props.name"  // [!code focus]
    :disabled="props.disabled"  // [!code focus]
    :required="props.required"  // [!code focus]
    :style="{  // [!code focus]
      transform: 'translateX(-100%)',  // [!code focus]
      position: 'absolute',  // [!code focus]
      pointerEvents: 'none',  // [!code focus]
      opacity: 0,  // [!code focus]
      margin: 0,  // [!code focus]
    }"  // [!code focus]
  >  // [!code focus]
</template>  // [!code focus]

```

::: details 点我查看结构解读🔝

1. 从目录上我们可以看到一个组件开发需要涉及到的一些非代码层面的东西，**测试用例**，**样式脚本**，**默认参数**，**类型导出**，**组件代码**，**组件示例**，**组件文档**。
2. 从组件代码中我们可以看到一个组件需要包括的代码层面的东西，**Props传值**，**国际化**，**默认图标**，**默认样式处理**，**主题处理**，**渲染逻辑处理**，**表单状态封装**，**事件处理**，**状态转换**，**双向绑定**。
:::

--------------------

通过以上3个UI库，我们大致可以总结一个局部的组件思维模型：

图4

--------------------

::: warning 注意，以上只是局部分析！
以上都是从组件目录开始的局部分析，本文旨在启发具体组件开发的思维，并非组件库架构，工程化建设，抑或是SSR等考量，所以请勿狭隘理解，本文旨在启发，抛砖引玉，关于组件库建设以及架构后续，我应该会单独开坑~
:::

--------------------

🖥️写在最后：

*以上就是这期【偷裤衩】的全部内容了，阅读源码就像是读书，沿着各个源码作者的编码思路进行探索的过程，这有助于帮助自己偷师百家，成为仙道巅峰之人。*
