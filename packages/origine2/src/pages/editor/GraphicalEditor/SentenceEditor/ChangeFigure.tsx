import CommonOptions from "../components/CommonOption";
import { ISentenceEditorProps } from "./index";
import styles from "./sentenceEditor.module.scss";
import ChooseFile from "../../ChooseFile/ChooseFile";
import { useValue } from "../../../../hooks/useValue";
import { getArgByKey } from "../utils/getArgByKey";
import TerreToggle from "../../../../components/terreToggle/TerreToggle";
import { useEffect } from "react";
import {Dropdown, TextField} from "@fluentui/react";
import useTrans from "@/hooks/useTrans";
import {EffectEditor} from "@/pages/editor/GraphicalEditor/components/EffectEditor";
import CommonTips from "@/pages/editor/GraphicalEditor/components/CommonTips";

export default function ChangeFigure(props: ISentenceEditorProps) {
  const t = useTrans('editor.graphical.sentences.changeFigure.');
  const isGoNext = useValue(!!getArgByKey(props.sentence, "next"));
  const figureFile = useValue(props.sentence.content);
  const figurePosition = useValue<"left" | "" | "right">("");
  const isNoFile = props.sentence.content === "";
  const id = useValue(getArgByKey(props.sentence, "id").toString() ?? "");
  const isShowEffectEditor = useValue(false);
  const json = useValue<string>(getArgByKey(props.sentence,'transform') as string);
  const duration = useValue<number|string>(getArgByKey(props.sentence,'duration') as number);
  useEffect(() => {
    /**
     * 初始化立绘位置
     */
    if (getArgByKey(props.sentence, "left")) {
      figurePosition.set("left");
    }
    if (getArgByKey(props.sentence, "right")) {
      figurePosition.set("right");
    }
  }, []);
  const submit = () => {
    const isGoNextStr = isGoNext.value ? " -next" : "";
    const pos = figurePosition.value !== "" ? ` -${figurePosition.value}` : "";
    const idStr = id.value !== "" ? ` -id=${id.value}` : "";
    const durationStr = duration.value===""?'':` -duration=${duration.value}`;
    const transformStr = json.value===""?'':` -transform=${json.value}`;
    props.onSubmit(`changeFigure:${figureFile.value}${pos}${idStr}${transformStr}${durationStr}${isGoNextStr};`);
  };

  return <div className={styles.sentenceEditorContent}>
    <div className={styles.editItem}>
      <CommonOptions key="isNoDialog" title={t("options.hide.title")}>
        <TerreToggle title="" onChange={(newValue) => {
          if (!newValue) {
            figureFile.set(t("options.hide.choose"));
          } else
            figureFile.set("none");
          submit();
        }} onText={t("options.hide.on")} offText={t("options.hide.off")} isChecked={isNoFile} />
      </CommonOptions>
      {!isNoFile &&
        <CommonOptions key="1" title={t("options.file.title")}>
          <>
            {figureFile.value + "\u00a0\u00a0"}
            <ChooseFile sourceBase="figure" onChange={(fileDesc) => {
              figureFile.set(fileDesc?.name ?? "");
              submit();
            }}
            extName={[".png", ".jpg", ".webp"]} />
          </>
        </CommonOptions>}
      <CommonOptions key="2" title={t('$editor.graphical.sentences.common.options.goNext.title')}>
        <TerreToggle title="" onChange={(newValue) => {
          isGoNext.set(newValue);
          submit();
        }} onText={t('$editor.graphical.sentences.common.options.goNext.on')} offText={t('$editor.graphical.sentences.common.options.goNext.off')} isChecked={isGoNext.value} />
      </CommonOptions>
      <CommonOptions title={t('options.position.title')} key="3">
        <Dropdown
          selectedKey={figurePosition.value}
          options={[
            { key: "left", text: t('options.position.options.left') },
            { key: "", text: t('options.position.options.center') },
            { key: "right", text: t('options.position.options.right') }
          ]}
          onChange={(ev, newValue: any) => {
            figurePosition.set(newValue?.key?.toString() ?? "");
            submit();
          }}
        />
      </CommonOptions>
      <CommonOptions title={t('options.id.title')} key="4">
        <input value={id.value}
          onChange={(ev) => {
            const newValue = ev.target.value;
            id.set(newValue ?? "");
          }}
          onBlur={submit}
          className={styles.sayInput}
          placeholder={t('options.id.placeholder')}
          style={{ width: "100%" }}
        />
      </CommonOptions>
      <CommonOptions key="23" title="显示效果选项">
        <TerreToggle title="" onChange={(newValue) => {
          isShowEffectEditor.set(newValue);
        }} onText="显示" offText="不显示" isChecked={isShowEffectEditor.value} />
      </CommonOptions>
      {isShowEffectEditor.value &&
        <div>
          <CommonTips text="提示：效果只有在切换到不同立绘或关闭之前的立绘再重新添加时生效。如果你要为现有的立绘设置效果，请使用单独的设置效果命令"/>
          <EffectEditor json={json.value.toString()} onChange={(newJson)=>{
            json.set(newJson );
            submit();
          }}/>
          <CommonOptions key="10" title="持续时间（单位为毫秒）">
            <div>
              <TextField placeholder="持续时间" value={duration.value.toString()} onChange={(_, newValue) => {
                const newDuration = Number(newValue);
                if (isNaN(newDuration) || newValue === '')
                  duration.set("");
                else
                  duration.set(newDuration);
                submit();
              }}/>
            </div>
          </CommonOptions>
        </div>
      }
    </div>
  </div>;
}
