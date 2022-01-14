import mitt from 'mitt'

export default function () {
  const numLocks = 1;
  const lockEventName = "queueUnlock";
  let locks = 0;
  let unlocker = mitt();

  const listen = (resolve) => {
    // "listen" for resolve from other semaphores
    unlocker.on(lockEventName, () => {
      console.log(`%c unLocked`, 'color: #004085; background-color: lightcoral; border-color: #b8daff; padding: 5px;');
      if (locks < numLocks){
        locks++;
        resolve();
      } else {
        listen(resolve);
      }
    });
  }

  const lock = () => {
    // wait until all locks are released before resolving
    return new Promise((resolve) => {
      if(locks < numLocks){
        locks++;
        resolve();
      } else {
        listen(resolve);
      }
    });
  }

  const unlock = async () => {
    // release lock once task is complete
    locks--;
    unlocker.emit(lockEventName);
  }

  return async (cb) => {
    await lock(); // prevent codeblock until a lock is available
    await cb(); // execute passed codeblock
    await unlock(); // release lock, allow other waiting semephores to execute
  }
}
