import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  msgDirection = [
    { id: 0, direction: 'None' },
    { id: 1, direction: 'Incoming' },
    { id: 2, direction: 'Outgoing' },
    { id: 3, direction: 'Historian' }
  ]

  alertLevelEnum = [
    { id: 0, name: 'Normal' },
    { id: 1, name: 'Info' },
    { id: 2, name: 'Warning' },
    { id: 3, name: 'Alert' },
    { id: 4, name: 'Critical' },
  ]

  alertTypeEnum = [
    { id: null, name: 'NA' },
    { id: 1, name: 'Value' },
    { id: 2, name: 'Range' },
    { id: 3, name: 'OutsideRange' },
    { id: 4, name: 'StdDev' },
    { id: 5, name: 'SP' }
  ]

  hmiNameEnum = [
    { id: 0, name: 'HMI1' },
    { id: 1, name: 'HMI2' },
    { id: 2, name: 'HMI3' },
  ]

  productionStatus = [
    { id: 0, status: 'Schedule' },
    { id: 1, status: 'Ongoing' },
    { id: 2, status: 'Finish' }
  ]

  deliveryEnum = [
    { id: 1, status: 'Cooling bed' },
    { id: 2, status: 'Coiler' },
  ]

  periodEnum = [
    { id: 0, direction: 'Hour' },
    { id: 1, direction: 'Shift' },
    { id: 2, direction: 'Day' },
    { id: 3, direction: 'Month' }
  ]

  productType = [
    { id: 1, name: 'Input' },
    { id: 2, name: 'Output' },
  ]

  comStatusEnum = [
    { id: 0, status: "None" },
    { id: 1, status: "Closed" },
    { id: 2, status: "Disconnected" },
    { id: 3, status: "Connecting" },
    { id: 4, status: "Waiting" },
    { id: 5, status: "ConnectingAndWaiting" },
    { id: 6, status: "Connected" }
  ];

  updateSource = [
    { id: 1, name: 'L1' },
    { id: 2, name: 'OperatorScreen' },
    { id: 3, name: 'ParameterList' },
    { id: 4, name: 'Excel' },
  ];

  castShape = [
    { id: 1, name: 'Square' },
    { id: 2, name: 'Rectangle' },
    { id: 3, name: 'RoundCorner' },
    { id: 4, name: 'TMT' },
    { id: 5, name: 'Round' },
    { id: 6, name: 'Angle' },
    { id: 7, name: 'Strip' },
    { id: 8, name: 'Z_Angle' },
    { id: 9, name: 'T' },
  ];


  eventType = [
    { id: 1, name: 'Info' },
    { id: 2, name: 'Warning' },
    { id: 3, name: 'Alert' },
    { id: 7, name: 'Level1' },
    { id: 8, name: 'Event' },
  ];

  triggerType = [
    { id: 0, name: 'Both' },
    { id: 1, name: 'Positive' },
    { id: 2, name: 'Negative' },
    { id: 3, name: 'None' },
  ]

  boolList = [
    { id: 0, name: 'False' },
    { id: 1, name: 'True' }
  ]

  modeSelection = [
    { id: true, name: 'Flying Mode' },
    { id: false, name: 'Crank Mode' },
  ]

  gearBoxRatio = [
    { id: false, name: 'Slow' },
    { id: true, name: 'Fast' },
  ]

  CalculationStatusEnum =
    [
      { id: 0, name: 'NotCalculated' },
      { id: 1, name: 'CalculationSuccessful' },
      { id: 2, name: 'NoEntryDiameterFound' },
      { id: 3, name: 'NoEntryDiameterFit' },
      { id: 4, name: 'ProductCalculationNotSuccessful' },
      { id: 5, name: 'InputNotPlausible' },
      { id: 6, name: 'DefinitionExistsButNotAvailable' },
      { id: 7, name: 'StandLoadExceeded' },
      { id: 8, name: 'MotorLimitsExceeded' },
      { id: 9, name: 'MotorLimitsExceededForPreselectedGearShift' },
      { id: 10, name: 'DeliveryOptionSpeedLimitsExceeded' },
      { id: -1, name: 'NotCalculatedWithUnknownError' },
    ]

  ProductionStatusEnum =
    [
      { id: -1, name: 'Initial' },
      { id: 0, name: 'Planning' },
      { id: 1, name: 'Schedule' },
      { id: 2, name: 'InProgress' },
      { id: 3, name: 'Finish' },
      { id: 4, name: 'HotOut' },
      { id: 5, name: 'MissRoll' },
    ]

  RollingStatusEnum =
    [
      { id: -1, name: 'Initial' },
      { id: 0, name: 'Planning' },
      { id: 1, name: 'Schedule' },
      { id: 2, name: 'InProgress' },
      { id: 3, name: 'Finish' }
    ]

  FurnaceStatusEnum =
    [
      { id: 0, name: 'InFurnace' },
      { id: 1, name: 'Next' },
      { id: 2, name: 'Charged' },
      { id: 3, name: 'Online' }

    ]

  orientationEnum = [
    { id: 0, name: 'Horizontal' }, { id: 1, name: 'Vertical' }
  ]

  standStatusEnum = [
    { id: 0, name: 'Normal' },
    { id: 1, name: 'Roll Change' },
    { id: 2, name: 'Due' },
  ]

  EquipmentStatusEnum = [
    { id: 0, name: 'UnMounted' },
    { id: 1, name: 'Mounted' },
    { id: 2, name: 'StandBy' },
    { id: 3, name: 'Ready' },
    { id: 4, name: 'Scrap' },
  ];

  EquipmentChangeStatusEnum = [
    { id: 0, name: 'Normal' },
    { id: 1, name: 'Due' },
    { id: 2, name: 'Overdue' },
  ];

  KocksStatusEnum =
    [
      { id: 0, name: 'Unknown' },
      { id: 1, name: 'CreatedNoDefinition' },
      { id: 2, name: 'AvailableForCalc' },
      { id: 3, name: 'Calculated' },
      { id: 4, name: 'Released' },
      { id: 5, name: 'Planned' },
      { id: 6, name: 'Faulty' },
    ];

  QualityTypeEnum =
    [
      { id: 0, name: 'NA', icon: '' },
      { id: 1, name: 'Good', icon: 'pi pi-check-circle' },
      { id: 2, name: 'Inspection', icon: 'pi pi-hourglass' },
      { id: 3, name: 'Defect', icon: 'pi pi-exclamation-triangle' },
    ];

  InspectionList =
    [
      { id: false, name: 'Not Inspected' },
      { id: true, name: 'Inspected' },
    ];

  MailCycleDurationList =
    [
      { id: -1, name: 'Shift' },
      { id: -2, name: 'Day' },
      { id: -3, name: 'Hour' },
    ];

  getProductTypeConstantInfo() {
    return this.productType;
  }

  getAlertLevelConstantInfo() {
    return this.alertLevelEnum;
  }

  getAlertTypeConstantInfo() {
    return this.alertTypeEnum;
  }

  getHMIConstantInfo() {
    return this.hmiNameEnum;
  }

  getDeliveryConstantInfo() {
    return this.deliveryEnum;
  }

  getUpdateSourceConstants() {
    return this.updateSource;
  }

  getCastShapeConstant() {
    return this.castShape;
  }

  getModeSelectionList() {
    return this.modeSelection;
  }

  getEventTypeConstant() {
    return this.eventType;
  }

  getComStatusConstantInfo() {
    return this.comStatusEnum;
  }

  getMsgDirInfo() {
    return this.msgDirection;
  }

  getProductionStatus() {
    return this.productionStatus;
  }

  getTriggerTypeConstants() {
    return this.triggerType;
  }

  getBoolListConstants() {
    return this.boolList;
  }

  getGearBoxRatioSelection() {
    return this.gearBoxRatio;
  }

  getCalculationnStatusEnum() {
    return this.CalculationStatusEnum;
  }

  getProductionStatusEnum() {
    return this.ProductionStatusEnum;
  }

  getRollingStatusEnum() {
    return this.RollingStatusEnum
  }

  getFurnaceStatusEnum() {
    return this.FurnaceStatusEnum;
  }

  getOrientationEnum() {
    return this.orientationEnum;
  }

  getStandStatusEnum() {
    return this.standStatusEnum;
  }

  getEquipmentStatusEnum() {
    return this.EquipmentStatusEnum;
  }

  getEquipmentChangeStatusEnum() {
    return this.EquipmentChangeStatusEnum;
  }

  getKocksStatusEnum() {
    return this.KocksStatusEnum;
  }

  getQualityTypeEnumList() {
    return this.QualityTypeEnum;
  }

  getInspectionList() {
    return this.InspectionList;
  }

  getMailCycleDurationList() {
    return this.MailCycleDurationList;
  }
}
