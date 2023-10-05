export let getErrorForParticularField: any = (errors: any) => {
    try {
      let errMsgs = Object.entries(errors);
      let errRes: any[] = [];
      errMsgs.forEach((element: any) => {
        errRes.push(element[1]['message'])
      });
      return errRes;
    } catch (error) {
      return [];
    }
  }