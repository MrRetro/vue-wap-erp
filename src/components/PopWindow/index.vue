<template>
  <div>
    <ChoosePop v-if="DEV"/>
    <ChooseMobilePop v-if="DEV"/>
    <choose-inner-color />
    <choose-out-color/>
    <MenuPop/>
    <ImageViewerPop/>
    <LoadingPop/>
    <yi-input-pop/>
    <DialogPop/>
    <SelectPop/>
    <RoutePop v-if="DEV"/>
  </div>
</template>

<script>
import {RUN_IN_DD} from '../../config';
import ChoosePop from './ChoosePop';
import ChooseInnerColor from './ChooseInnerColor';
import ChooseOutColor from './ChooseOutColor';
import MenuPop from './MenuPop';
import ImageViewerPop from './ImageViewerPop';
import ChooseMobilePop from './ChooseMobilePop';
import LoadingPop from './LoadingPop';
import RoutePop from './RoutePop';
import DialogPop from './DialogPop';
import SelectPop from './SelectPop';

export default {
  name: 'globalWindow',
  components: {
    ChoosePop,
    ChooseInnerColor,
    ChooseOutColor,
    MenuPop,
    ImageViewerPop,
    ChooseMobilePop,
    LoadingPop,
    RoutePop,
    DialogPop,
    SelectPop
  },
  data() {
    return {
      DEV: !RUN_IN_DD
    };
  }
};
</script>
