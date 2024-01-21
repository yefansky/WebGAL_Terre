import useTrans from "@/hooks/useTrans";
import CommonOptions from "../components/CommonOption";
import {ISentenceEditorProps} from "./index";
import styles from "./sentenceEditor.module.scss";
import {getArgByKey} from "@/pages/editor/GraphicalEditor/utils/getArgByKey";
import {useValue} from "@/hooks/useValue";
import {DefaultButton, Dropdown, PrimaryButton, TextField} from "@fluentui/react";
import {EffectEditor} from "@/pages/editor/GraphicalEditor/components/EffectEditor";
import TerreToggle from "@/components/terreToggle/TerreToggle";
import {TerrePanel} from "@/pages/editor/GraphicalEditor/components/TerrePanel";
import {useExpand} from "@/hooks/useExpand";

export default function SetTransform(props: ISentenceEditorProps) {
  // const t = useTrans('editor.graphical.components.template.');
  const tTarget = useTrans('editor.graphical.sentences.setAnime.options.');
  const {sentence} = props;
  const json = sentence.content;
  const durationFromArgs = getArgByKey(sentence, 'duration');
  const transform = useValue((json ?? '') as string);
  const duration = useValue((durationFromArgs ?? 0) as number);
  const {updateExpandIndex} = useExpand();
  const isGoNext = useValue(!!getArgByKey(props.sentence, "next"));
  const target = useValue(getArgByKey(props.sentence, "target")?.toString() ?? "");
  const isPresetTarget = ["bg-main", "fig-left", "fig-center", "fig-right"].includes(target.value);
  const isUsePreset = useValue(isPresetTarget);
  const submit = () => {
    const isGoNextStr = isGoNext.value ? " -next" : "";
    const str = `setTransform:${transform.value} -target=${target.value} -duration=${duration.value}${isGoNextStr};`;
    props.onSubmit(str);
  };


  return <div className={styles.sentenceEditorContent}>
    <div className={styles.editItem}>
      <CommonOptions title="效果编辑">
        <DefaultButton onClick={() => {
          updateExpandIndex(props.index);
        }}>{tTarget('$打开效果编辑器')}</DefaultButton>
        <TerrePanel sentenceIndex={props.index} title={tTarget("$效果编辑器")}>
          <EffectEditor json={transform.value} onChange={(newJson)=>{
            transform.set(newJson);
            submit();
          }}/>
        </TerrePanel>
      </CommonOptions>
      <CommonOptions key="10" title={tTarget('duration.title')}>
        <div>
          <TextField placeholder={tTarget("$持续时间（单位为毫秒）")} value={duration.value.toString()} onChange={(_, newValue) => {
            const newDuration = Number(newValue);
            if (isNaN(newDuration))
              duration.set(0);
            else
              duration.set(newDuration);
          }} onBlur={submit}/>
        </div>
      </CommonOptions>
      <CommonOptions key="2" title={tTarget('preparedTarget.title')}>
        <TerreToggle title="" onChange={(newValue) => {
          isUsePreset.set(newValue);
        }} onText={tTarget('preparedTarget.on')} offText={tTarget('preparedTarget.off')}
        isChecked={isUsePreset.value} />
      </CommonOptions>
      {isUsePreset.value && <CommonOptions key="3" title={tTarget('preparedTarget.choose.title')}>
        <Dropdown styles={{ dropdown: { width: "100px" } }} onChange={(event, option, index) => {
          target.set(option?.key.toString() ?? "");
          submit();
        }} options={[
          { key: "fig-left", text: tTarget('preparedTarget.choose.options.figLeft') },
          { key: "fig-center", text: tTarget('preparedTarget.choose.options.figCenter') },
          { key: "fig-right", text: tTarget('preparedTarget.choose.options.figRight') },
          { key: "bg-main", text: tTarget('preparedTarget.choose.options.bgMain') }
        ]} selectedKey={target.value} />
      </CommonOptions>}
      {!isUsePreset.value && <CommonOptions key="4" title={tTarget('targetId.title')}>
        <input value={target.value}
          onChange={(ev) => {
            const newValue = ev.target.value;
            target.set(newValue ?? "");
          }}
          onBlur={submit}
          className={styles.sayInput}
          placeholder={tTarget('targetId.placeholder')}
          style={{ width: "100%" }}
        />
      </CommonOptions>}
      <CommonOptions key="20" title={tTarget('$editor.graphical.sentences.common.options.goNext.title')}>
        <TerreToggle title="" onChange={(newValue) => {
          isGoNext.set(newValue);
          submit();
        }} onText={tTarget('$editor.graphical.sentences.common.options.goNext.on')} offText={tTarget('$editor.graphical.sentences.common.options.goNext.off')} isChecked={isGoNext.value} />
      </CommonOptions>
    </div>
  </div>;
}