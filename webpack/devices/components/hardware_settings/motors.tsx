import * as React from "react";
import { t } from "i18next";
import { BooleanMCUInputGroup } from "../boolean_mcu_input_group";
import { ToolTips } from "../../../constants";
import { SpacePanelToolTip } from "../space_panel_tool_tip";
import { ToggleButton } from "../../../controls/toggle_button";
import { settingToggle } from "../../actions";
import { NumericMCUInputGroup } from "../numeric_mcu_input_group";
import { MotorsProps } from "../interfaces";
import { Row, Col } from "../../../ui/index";
import { Header } from "./header";
import { Collapse } from "@blueprintjs/core";
import { McuInputBox } from "../mcu_input_box";
import { minFwVersionCheck } from "../../../util";
import { StepsPerMmSettings } from "./steps_per_mm_settings";

export function Motors(props: MotorsProps) {
  const { dispatch, bot, sourceFbosConfig } = props;
  const { mcu_params } = bot.hardware;
  const { motors } = bot.controlPanelState;
  const { firmware_version } = bot.hardware.informational_settings;

  return <section>
    <Header
      bool={motors}
      title={t("Motors")}
      name={"motors"}
      dispatch={dispatch} />
    <Collapse isOpen={!!motors}>
      <Row>
        <Col xs={6}>
          <label>
            {t("Max Retries")}
          </label>
          <SpacePanelToolTip tooltip={ToolTips.MAX_MOVEMENT_RETRIES} />
        </Col>
        <Col xs={6}>
          <McuInputBox
            setting="param_mov_nr_retry"
            bot={bot}
            dispatch={dispatch} />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <label>
            {t("E-Stop on Movement Error")}
          </label>
          <SpacePanelToolTip tooltip={ToolTips.E_STOP_ON_MOV_ERR} />
        </Col>
        <Col xs={2} className={"centered-button-div"}>
          <ToggleButton
            toggleValue={mcu_params.param_e_stop_on_mov_err}
            toggleAction={() =>
              settingToggle("param_e_stop_on_mov_err", bot, undefined)} />
        </Col>
      </Row>
      <NumericMCUInputGroup
        name={t("Max Speed (steps/s)")}
        tooltip={ToolTips.MAX_SPEED}
        x={"movement_max_spd_x"}
        y={"movement_max_spd_y"}
        z={"movement_max_spd_z"}
        bot={bot}
        dispatch={dispatch} />
      {minFwVersionCheck(firmware_version, "5.0.5") &&
        <NumericMCUInputGroup
          name={t("Homing Speed (steps/s)")}
          tooltip={ToolTips.HOME_SPEED}
          x={"movement_home_spd_x"}
          y={"movement_home_spd_y"}
          z={"movement_home_spd_z"}
          bot={bot}
          dispatch={dispatch} />}
      <NumericMCUInputGroup
        name={t("Minimum Speed (steps/s)")}
        tooltip={ToolTips.MIN_SPEED}
        x={"movement_min_spd_x"}
        y={"movement_min_spd_y"}
        z={"movement_min_spd_z"}
        bot={bot}
        dispatch={dispatch} />
      <NumericMCUInputGroup
        name={t("Accelerate for (steps)")}
        tooltip={ToolTips.ACCELERATE_FOR}
        x={"movement_steps_acc_dec_x"}
        y={"movement_steps_acc_dec_y"}
        z={"movement_steps_acc_dec_z"}
        bot={bot}
        dispatch={dispatch} />
      <StepsPerMmSettings
        dispatch={dispatch}
        bot={bot}
        sourceFbosConfig={sourceFbosConfig} />
      <BooleanMCUInputGroup
        name={t("Always Power Motors")}
        tooltip={ToolTips.ALWAYS_POWER_MOTORS}
        x={"movement_keep_active_x"}
        y={"movement_keep_active_y"}
        z={"movement_keep_active_z"}
        dispatch={dispatch}
        bot={bot} />
      <BooleanMCUInputGroup
        name={t("Invert Motors")}
        tooltip={ToolTips.INVERT_MOTORS}
        x={"movement_invert_motor_x"}
        y={"movement_invert_motor_y"}
        z={"movement_invert_motor_z"}
        dispatch={dispatch}
        bot={bot} />
      <Row>
        <Col xs={6}>
          <label>
            {t("Enable 2nd X Motor")}
          </label>
          <SpacePanelToolTip tooltip={ToolTips.ENABLE_X2_MOTOR} />
        </Col>
        <Col xs={2} className={"centered-button-div"}>
          <ToggleButton
            toggleValue={mcu_params.movement_secondary_motor_x}
            toggleAction={() =>
              settingToggle("movement_secondary_motor_x", bot, undefined)} />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <label>
            {t("Invert 2nd X Motor")}
          </label>
          <SpacePanelToolTip tooltip={ToolTips.INVERT_MOTORS} />
        </Col>
        <Col xs={2} className={"centered-button-div"}>
          <ToggleButton
            grayscale={!mcu_params["movement_secondary_motor_x"]}
            toggleValue={mcu_params.movement_secondary_motor_invert_x}
            toggleAction={() =>
              settingToggle("movement_secondary_motor_invert_x", bot, undefined)} />
        </Col>
      </Row>
    </Collapse>
  </section>;
}
