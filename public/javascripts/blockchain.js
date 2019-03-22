var difficulty = 3;        // number of zeros required at front of hash
var maximumNonce = 500000; // limit the nonce to this so we don't mine too long
var blocks = 5;

// NOTE: Because there are 16 possible characters in a hex value, each time you increment
// the difficulty by one you make the puzzle 16 times harder. In my testing, a difficulty
// of 6 requires a maximumNonce well over 500,000,000.

/////////////////////////
// global variable setup
/////////////////////////
var pattern = '';
for (var x=0; x<difficulty; x++) {
  pattern += '0';
}

/////////////////////////
// functions
/////////////////////////
function sha256(block, chain) {
  // calculate a SHA256 hash of the contents of the block
  return CryptoJS.SHA256(getText(block, chain));
}


function updateState(block, chain) {
  // set the well background red or green for this block
  if ($('#block'+block+'chain'+chain+'hash').val().substr(0, difficulty) === pattern) {
    //$('#block'+block+'chain'+chain+'well').removeClass('well-error').addClass('well-success');
    $('#block'+block+'chain'+chain+'icon').html('<i class="demo-icon icon-ok color-success"></i>');

  }
  else {
    //$('#block'+block+'chain'+chain+'well').removeClass('well-success').addClass('well-error');
    $('#block'+block+'chain'+chain+'icon').html('<i class="demo-icon icon-cancel color-error"></i>');
  }
}

function setBlocks(count) {
  blocks = count;
}


function calcBobCredentials() {
  console.log("calcBobCredentials");
  let temp = "";
  temp = CryptoJS.SHA256(getBobSeed());
  $('#bobPrivKey').val(temp);
  temp = CryptoJS.SHA256(temp);
  $('#bobPubKey').val(temp);
  temp = CryptoJS.SHA256(temp).toString().substr(0,32);
  $('#bobPKH').val(temp);
}

function calcAliceCredentials() {
  console.log("calcAliceCredentials");
  let temp = "";
  temp = CryptoJS.SHA256(getAliceSeed());
  $('#alicePrivKey').val(temp);
  temp = CryptoJS.SHA256(temp);
  $('#alicePubKey').val(temp);
  temp = CryptoJS.SHA256(temp).toString().substr(0,32);
  $('#alicePKH').val(temp);
}


function updateDataHash(block, chain) {
  console.log("updateDataHash");
  $('#block'+block+'chain'+chain+'data').val(CryptoJS.SHA256($('#block'+block+'chain'+chain+'txData').html()));
}


function updateHash(block, chain) {
  console.log("updateHash");
  // update the SHA256 hash value for this block
  $('#block'+block+'chain'+chain+'hash').val(sha256(block, chain));
  updateState(block, chain);
}

function updateChain(block, chain) {
  console.log("updateChain");
  // update all blocks walking the chain from this block to the end
  for (var x = block; x <= 3; x++) {
    if (x > 1) {
      $('#block'+x+'chain'+chain+'previous').val($('#block'+(x-1).toString()+'chain'+chain+'hash').val());
    }
    updateDataHash(x, chain);
    updateHash(x, chain);

  }

}

function mine(block, chain, isChain) {
  console.log("mine");
  for (var x = 0; x <= maximumNonce; x++) {
    $('#block'+block+'chain'+chain+'nonce').val(x);
    $('#block'+block+'chain'+chain+'hash').val(sha256(block, chain));
    if ($('#block'+block+'chain'+chain+'hash').val().substr(0, difficulty) === pattern) {
      if (isChain) {
        updateChain(block, chain);
      }
      else {
        updateState(block, chain);
      }
      break;
    }
  }
}

function minerBlockMine() {
  for (var x = 0; x <= maximumNonce; x++) {
    $('#block1chain2nonce').val(x);
    $('#block1chain2hash').val(sha256(1, 2));
    if ($('#block1chain2hash').val().substr(0, difficulty) === pattern) {
      updateHash(1, 2);
      break;
    }

  }
}