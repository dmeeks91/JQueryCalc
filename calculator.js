//Show Key Press on Input Screen
var show = function(input)
{
  var isOp = isOperator(input);
  var lstChar = currChar();
  var numstr =$("#screen").val();
  switch (isOp)
    {
      case true:
        if(lstChar[0]==-1)
          {return;}
        if (lstChar[1]==')'||$.isNumeric(lstChar[1]))
          {numstr+=' '+input+' ';}
        break;
      default:
        if (lstChar[1]==')')
          {numstr+=' x '+input;}
        else
          {numstr += input;}
    }
  $("#screen").val(numstr);
}

  //Validate User Input
var valScreen = function()
{
  var scrnVal =$("#screen").val(); 
  var numStr='';
  var newStr = false;
  
  //Remove spaces and alpha characters
  for (var i = 0, end = scrnVal.length;i<end;i++)
    {
      var char= scrnVal[i];
      if ($.isNumeric(char)||isOperator(char)||char=='.')
        {
          numStr+=char;
        }
    }
  
  //Remove first char if = operator but not '-' or '('
  var begChck = false;
  while(begChck=false)
    {
      if ($.isNumeric(numStr[0])||numStr[0]=='-'||isPrnth(numStr[0]))
        {
          begChck=true;
        }
      else
        {
          numStr = numStr.substr(1);
        }
    }
  
  //Throw error if back to back operators
   var exit=false;
   for (var i = 1, end = numStr.length;i<end;i++)
    {
      switch(isOperator(numStr[i]))
        {
          case false:
            break;
          case true:
            if (numStr[i]=='-'&&numStr[i-1]=='(')
              {break;}
            else if (!isPrnth(numStr[i-1])&&!isPrnth(numStr[i])&&isOperator(numStr[i-1]))
              {
                exit = true;
                i=end+1;
              }
        }
    }
    if (exit)
      {
        return false;
      }
    else
      {
        $("#screen").val(numStr);
        return true;
      }  
}

//Eval Parenthesis
var evalPrnth = function(pObject,numStr)
{
  //console.log(numStr);
  var opnP = pObject.Open;
  var cPOrder= pObject.Closed;
  var prthList = pairPrnth(opnP,numStr);
  var clsdP = prthList;
  var newNumStr = numStr;
  var newPC=0;
  var results=[];
  var i;
  var nxtOP;
  var pCnts = '';
  var Cnts='';
  var indx;
  var lstChar;
        for (var j=0, end=cPOrder.length;j<end;j++)
        {
          i = clsdP.indexOf(cPOrder[j]);
          pCnts= numStr.slice(opnP[i],clsdP[i]+1); //contents including parenthesis
          Cnts=numStr.slice(opnP[i]+1,clsdP[i]); //contents only
          nxtOP=Cnts.indexOf('(');
          
          newPC = setEval(Cnts);
          console.log(newPC);
          if(isNegative(newPC.toString()))
            {
              indx=newNumStr.indexOf(pCnts);
              lstChar=prvChar(newNumStr,indx-1)[1];
              if(lstChar=='+')
                {
                  newNumStr = newNumStr.replace('+' + pCnts,newPC);
                  results[i]=(newPC);
                }
              else if(lstChar=='-')
                {
                  newPC*=-1;
                  newNumStr = newNumStr.replace(pCnts,newPC);
                  results[i]=(newPC);
                }
              else if(isOperator(lstChar))
                {
                  newNumStr = newNumStr.replace(pCnts,'('+newPC+')');
                  results[i]=(newPC);
                }
              else
                {
                  newNumStr = newNumStr.replace(pCnts,newPC);
                  results[i]=(newPC);
                }
            }
          else
            {
              newNumStr = newNumStr.replace(pCnts,newPC);
              results[i]=(newPC);
            }
          }
  return newNumStr;
}

//Pre-eval step ... determine numbers to be operated on pass to eval and return answer
var setEval = function(numStr)
{
  var num ='';
  var thisOp = '';
  var frst = 0;
  var lst = 0;
  var answr = 0;
  var num1 = 0;
  var num2 = 0;
    for(var i = 0, end= numStr.length;i<=end;i++)
    {      
      if(isOperator(numStr[i])&&i!=0&&!isPrnth(numStr[i]))
        { 
          lst = i;
          switch (num1)
            {
              case 0:
                num1 = numStr.slice(frst,lst);
                break;
              default:
                num2=numStr.slice(frst,lst);
                answr=eval(Number(num1),thisOp,Number(num2));
                num1=answr;
            }
          thisOp=numStr[i];
          frst=i+1;
        }
      else if (i==end)
        {
           if (num1==0)
             {
               answr=numStr;
             }
           else
             {
               num2=numStr.slice(frst,end);
               answr=eval(Number(num1),thisOp,Number(num2));
             }           
        }
    }
  return answr;
}

//Return Solution Function for any two variables and operator
var eval = function(p1,op,p2)
{
  //console.log('part1: '+p1+' operator: '+op+' part2: '+ p2);
  switch(op)
    {
      case '+':
        return p1+p2;
      case '-':
        return p1-p2;
      case 'x':
      case 'X':
      case '*':
        return p1*p2;
      case '÷': 
      case '/':
        return p1/p2;;
    }
}

var isOperator = function(op)
{
  var posOps = ['-','+','*','x','X','/','÷','(',')'];
  return(posOps.indexOf(op)>-1);
}

var isPrnth =function(op)
{
  var posOps = ['(',')'];
  return(posOps.indexOf(op)>-1);
}

var prvChar = function(strVal, end)
{
  for (var i = end;i>=0;i--)
    {
      if (strVal[i]!= ' ')
        {return [i,strVal[i]];}
    }
  return [-1,-1];
}

var currChar=function()
{
  var scrnVal =$("#screen").val();
  for (var i = scrnVal.length-1;i>=0;i--)
    {
      if (scrnVal[i]!= ' ')
        {return [i,scrnVal[i]];}
    }
  return[-1,-1];
}

var isPOpen = function(valStep,numStr)
{
  if(!numStr){numStr =$("#screen").val();}
  var OpenP =[];
  var ClosedP = [];
  for (var i = 0, end = numStr.length;i<end;i++)
    {
      if (numStr[i]=='(')
        {
          OpenP.push(i);
        }
      else if (numStr[i]==')')
        {
          ClosedP.push(i);
        }
    }
  if (OpenP.length>ClosedP.length)
    {
      if(OpenP.length==ClosedP.length+1 && $.isNumeric(numStr[numStr.length-1])&& valStep ===true)
        {
          $("#screen").val(numStr + ')');
            ClosedP.push(numStr.length);
            return {Open:OpenP,Closed:ClosedP};
        }
      return true;
    }
  else if (OpenP.length==ClosedP.length)
    {
      if (OpenP.length ==0)
        {
          return -1;
        }
      return {Open:OpenP,Closed:ClosedP};
    }
  else
    {
      return -1;
    }
}

var pairPrnth = function(opnPs,numstr)
{
  //console.log(opnPs);
  var clsdPs = [];
  var idxOp;
  var idxCl;
  var nwOpn=false;
  var Found= false;
  //Loop through all open parenthesis
  for (var i=0, end = opnPs.length;i<end;i++)
    {
      idxOp = opnPs[i];
      for(var j=idxOp+1,k=numstr.length;j<k;j++)
        {
          switch(numstr[j])
            {
              case '(':
                nwOpn=true;
                break;
              case ')':
                if (nwOpn)
                  {nwOpn=false;}
                else
                  {Found = true;}
                break;
            }
          if (Found)
            {
              clsdPs[i]=j;
              j=k;
              Found=false;
            }
        }
    }
  //console.log(clsdPs);
  return clsdPs;
  
}

var lastNum = function()
{
  var scrnVal =$("#screen").val();
  if (scrnVal.length == 0||scrnVal[scrnVal.length-1]==' '||scrnVal[scrnVal.length-1]==')')
    {
      return -1;
    }
  else
    {
      for (var i = scrnVal.length-1;i>=0;i--)
      {
        if ($.isNumeric(scrnVal[i])&&scrnVal[i-1]==' ')
          {
            return [scrnVal.slice(i),i];
          }
        else if ($.isNumeric(scrnVal[i])&&(scrnVal[i-1]=='-'&&scrnVal[i-2]=='('||scrnVal[i-2]=='('))
          {
            return [scrnVal.slice(i-2),i];
          }
      }
      return scrnVal;
    }
}

var isNegative = function(num)
{
  if(num[0]=='-'||(num[0]=='('&&num[1]=='-'))
    {
      return true;
    }
  return false;
}

$(document).ready(function()
{
  //Add Show click event to Calc Keys 
  var numkeys = $(".cKey");
  var numVal=0;
  for (var i= 0; i<numkeys.length;i++)
    {
      numkeys[i].onclick = function(e)
      {
        numVal= this.innerHTML;
        show(numVal);
      }
    }

//Clear Input Screen on button Click 
$("#clr").on('click',function()
{
  $("#screen").val("");
});

//Backspace Button Click
$("#bck").on('click',function()
  {
    var numstr=$("#screen").val();
    var end = currChar();
    if (isOperator(end[1]))
      {$("#screen").val(numstr.slice(0,end[0]-1));}
    else
      {$("#screen").val(numstr.slice(0,end[0]));}    
  });

//+/- Button Click Function
$("#posNeg").on('click',function()
  {
    var thisNum = lastNum();
    var newNum; 
    var numStr =  $("#screen").val();
    if (thisNum==-1)
      {
        numStr += '(-';
      }
    else if (isNegative(thisNum))
      {
        newNum=thisNum.replace('(-','');
        numStr = numStr.replace(thisNum,newNum);
      }
    else
      {
        newNum='(-'+thisNum;
        numStr = numStr.replace(thisNum,newNum);
      }
    $("#screen").val(numStr);
  });

//Decimal Button Click Function
$("#deci").on('click',function()
{
  var numstr=$("#screen").val();
  var thisNum = currChar();
  if (numstr.length==0||isOperator(thisNum[1]))
    {
      show('0.');
      return;
    }
  if (thisNum[1].indexOf('.')==-1)
    {
      show('.');
    }
});

//Equal Button Click Function
$("#eq").on('click',function()
{
  //var numStr =$("#screen").val();
  
  //Remove any alpha characters throw error if repeat operators
  var isValid = valScreen();
  if (!isValid)
    {
      alert("Invalid use of Operators")
      return;
    }
    
  //Exit if all parenthesis are not closed
  //////////////////////////////////////////Still Need to code for Prnth inside of prnth////////////////////////////////////////
  var chkPrnth =isPOpen(true);//, numStr);
  var numStr =$("#screen").val();
  var y=0;
  if (chkPrnth===true)
    {
      alert("Invalid Input: Be sure to close all parentheses");
      return;
    }
  //Evaluate Parenthesis, if any
  if (chkPrnth==-1)
    {}
  else
    {
      do
      {
        numStr = evalPrnth(chkPrnth,numStr);
        console.log(numStr);
        chkPrnth= isPOpen(true, numStr);
        y=numStr.indexOf('(');
      }while(y>=0);
      
    }

  //Evaluate Equation & show on screen
  numStr=setEval(numStr);
  $("#screen").val(numStr);  
});

//Parenthesis Button Click Function
$("#prnth").on('click',function()
  {
      var scrnVal =$("#screen").val();
      var opn = isPOpen(false,scrnVal);
      var lstChar = currChar();
      if (opn==-1&&scrnVal.length==0)
        {
          $("#screen").val(scrnVal + '(');
          return;
        }
      switch (opn)
        {
          case true:
            if ($.isNumeric(lstChar[1]))
              {
                $("#screen").val(scrnVal + ')');
                break;
              }
            else if (isOperator(lstChar[1]))
              {
                if(lstChar[1]==')')
                  {$("#screen").val(scrnVal + ')');}
                else
                  {$("#screen").val(scrnVal + '(');}
                break;
              }
            break;
          default:
            if ($.isNumeric(lstChar[1])||lstChar[1]==')')
              {$("#screen").val(scrnVal + ' x (');}
            else
              {$("#screen").val(scrnVal + ' (');}
        }
        
  });

});