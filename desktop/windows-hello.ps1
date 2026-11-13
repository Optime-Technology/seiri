# HWND sahipliği olan resmi Microsoft masaüstü doğrulama arabirimi.
$ErrorActionPreference='Stop'
try {
 $inputData=[Console]::In.ReadToEnd()|ConvertFrom-Json
 Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
using System.Threading;
public static class ZamanHello {
 [DllImport("combase.dll")] static extern int RoInitialize(uint type);
 [DllImport("combase.dll",CharSet=CharSet.Unicode)] static extern int WindowsCreateString(string text,int length,out IntPtr value);
 [DllImport("combase.dll")] static extern int WindowsDeleteString(IntPtr value);
 [DllImport("combase.dll")] static extern int RoGetActivationFactory(IntPtr name,ref Guid iid,out IntPtr factory);
 [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int Request(IntPtr self,IntPtr hwnd,IntPtr message,ref Guid iid,out IntPtr operation);
 [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int GetValue(IntPtr self,out int value);
 static IntPtr Slot(IntPtr obj,int slot){return Marshal.ReadIntPtr(Marshal.ReadIntPtr(obj),slot*IntPtr.Size);}
 public static int Verify(long window){RoInitialize(0);IntPtr name=IntPtr.Zero,message=IntPtr.Zero,factory=IntPtr.Zero,operation=IntPtr.Zero,info=IntPtr.Zero;try {
  string runtime="Windows.Security.Credentials.UI.UserConsentVerifier";Marshal.ThrowExceptionForHR(WindowsCreateString(runtime,runtime.Length,out name));Guid interop=new Guid("39E050C3-4E74-441A-8DC0-B81104DF949C");Marshal.ThrowExceptionForHR(RoGetActivationFactory(name,ref interop,out factory));string prompt="Seiri: hassas etkinligi acmak icin kimligini dogrula.";Marshal.ThrowExceptionForHR(WindowsCreateString(prompt,prompt.Length,out message));Guid asyncId=new Guid("fd596ffd-2318-558f-9dbe-d21df43764a5");var request=(Request)Marshal.GetDelegateForFunctionPointer(Slot(factory,6),typeof(Request));Marshal.ThrowExceptionForHR(request(factory,new IntPtr(window),message,ref asyncId,out operation));Guid infoId=new Guid("00000036-0000-0000-C000-000000000046");Marshal.ThrowExceptionForHR(Marshal.QueryInterface(operation,ref infoId,out info));var status=(GetValue)Marshal.GetDelegateForFunctionPointer(Slot(info,7),typeof(GetValue));int value=0;DateTime until=DateTime.UtcNow.AddMinutes(2);do{Marshal.ThrowExceptionForHR(status(info,out value));if(value!=0)break;Thread.Sleep(100);}while(DateTime.UtcNow<until);if(value!=1)return -1;var results=(GetValue)Marshal.GetDelegateForFunctionPointer(Slot(operation,8),typeof(GetValue));Marshal.ThrowExceptionForHR(results(operation,out value));return value;
 }finally{if(info!=IntPtr.Zero)Marshal.Release(info);if(operation!=IntPtr.Zero)Marshal.Release(operation);if(factory!=IntPtr.Zero)Marshal.Release(factory);if(name!=IntPtr.Zero)WindowsDeleteString(name);if(message!=IntPtr.Zero)WindowsDeleteString(message);}}
}
'@
 $result=[ZamanHello]::Verify([long]$inputData.hwnd)
 [Console]::Out.WriteLine((@{verified=($result -eq 0);result=$result}|ConvertTo-Json -Compress))
}catch{[Console]::Out.WriteLine('{"verified":false,"result":-1}')}
