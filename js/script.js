let urinals = []
function urinalsGenrator(){
    function randNumGenerator(val1, val2){
        let randomFloat = Math.random()
        return randomFloat*(val2-val1) + val1
    }

    numOfUrinals = Math.ceil(randNumGenerator(3,10))

    //generating status of urinals, 10->empty 11->occupied
    for(let i=0; i<numOfUrinals; i++){
        tempVal = Math.ceil(randNumGenerator(0,2))// 1->empty 2->occupied
        if (tempVal == 1){
            urinals.push(10)
        }
        else{
            urinals.push(11)
        }
    }

    console.log(urinals)

    function urinalCurrCrowd(index){
        count = 0
        let x = index
        let y = index
        while((x-1)>=0 && urinals[x-1]==11 ){
            count++
            x--
        }
        x = index
        while((x+1)<numOfUrinals && urinals[x+1]==11){
            count++
            x++
        }
        return count
    }


    //for assigning points to empty urinals
    let min = 20
    let max = -1
    let sum = 0
    let countOfEmpty = 0
    for (let i=0; i<numOfUrinals; i++){
        if(urinals[i] == 10){
            crowdNum = urinalCurrCrowd(i)
            urinals[i] = crowdNum
            if(crowdNum >= max) max = crowdNum
            if(crowdNum <= min) min = crowdNum
            sum += crowdNum
            countOfEmpty++
        }
    }

    let avg = sum/countOfEmpty
    avg = Math.ceil(avg)

    for (let i=0; i<numOfUrinals; i++){
        if(urinals[i] != 11){
            if (countOfEmpty == 1 || (max == min)){
                urinals[i]=4
            }
            else if (countOfEmpty == 2 && (max-min)<3){
                if (urinals[i] == max) urinals[i] = 3
                else urinals[i] = 4
            }
            else{
                if (urinals[i] == max) urinals[i] = 0
                else if (urinals[i] == min) urinals[i] = 4
                else if(urinals[i] == avg) urinals[i] = 2
                else if(urinals[i] > avg) urinals[i] = 1
                else urinals[i] = 3
            }
        }
    }
    return urinals
}

countCycle = 5

let tempElem_withMan = '<img class="urinating-stickman" src="/assets/images/stickman03.png" alt="stickman"><img class="urinal" src="/assets/images/urinal.png" alt="stickman">'
let tempElem_withoutMan = '<a href="#"><img class="urinal" src="/assets/images/urinal.png" alt="stickman"></a>'

function waitForEvent(element, eventName) {
    return new Promise((resolve) => {
      element.addEventListener(eventName, function handler(event) {
        let target = event.target
        val = target.parentElement.parentElement.id
        console.log(typeof(val))
        console.log('this is something' + val)

        if (val == 'urinals'){
            val = 0;
        }
        else {
            val = Number(val)
        }
        console.log('ID is ' + val + ' and value is ' + urinals[val-1])
        element.removeEventListener(eventName, handler);
        resolve(val);
      });
    });
  }

async function main(params) {
    eventName = 'click'
    sum = 0
    tempCount = 1
    let urinalDiv = document.getElementById("urinals")
    while(countCycle > 0){
        let innerHtml = ''
        urinals = []
        let urinalsAsArray = urinalsGenrator() 
        let lengthOfArray = urinalsAsArray.length
        

        console.log(urinalsAsArray)
        for (let i=0; i<lengthOfArray; i++){
            let tempImageElem = ''
        
            if (urinalsAsArray[i]==11) tempImageElem = tempElem_withMan
            else tempImageElem = tempElem_withoutMan
        
            let tempElem = `<div class="urinal-and-stickman" id=${(i+1).toString()}>${tempImageElem}</div>`
            innerHtml = innerHtml + tempElem
        
            urinalDiv.innerHTML = innerHtml
            
        }

        value = await waitForEvent(urinalDiv, eventName)
        if (typeof(value) == 'number' && value > 0) {
            sum += urinals[value - 1]
            tempCount += 1
        }
        
        countCycle -= 1;
    }
    console.log(sum)

    textHeader = document.getElementsByClassName("urinal-text")
    textHeader.innerHTML = 'This is your final score'

    scoreDiv = `<div class='final-score'>${Math.floor(4-(sum/tempCount))} Colours </div>`
    urinalDiv.innerHTML = scoreDiv
}

main()


//urinalDiv.innerHTML='<div> HIi <img class="urinal" src="/assets/images/urinal.png" alt="stickman"></div>'