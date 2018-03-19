const fs = require(`fs`)
const path = require(`path`)

const cheerio = require(`cheerio`)
const flatten = require(`just-flatten`)

const books = {
	GEN: `Genesis`,
	EXO: `Exodus`,
	LEV: `Leviticus`,
	NUM: `Numbers`,
	DEU: `Deuteronomy`,
	JOS: `Joshua`,
	JDG: `Judges`,
	RUT: `Ruth`,
	'1SA': `1 Samuel`,
	'2SA': `2 Samuel`,
	'1KI': `1 Kings`,
	'2KI': `2 Kings`,
	'1CH': `1 Chronicles`,
	'2CH': `2 Chronicles`,
	EZR: `Ezra`,
	NEH: `Nehemiah`,
	EST: `Esther`,
	JOB: `Job`,
	PSA: `Psalms`,
	PRO: `Proverbs`,
	ECC: `Ecclesiastes`,
	SNG: `Song of Solomon`,
	ISA: `Isaiah`,
	JER: `Jeremiah`,
	LAM: `Lamentations`,
	EZK: `Ezekiel`,
	DAN: `Daniel`,
	HOS: `Hosea`,
	JOL: `Joel`,
	AMO: `Amos`,
	OBA: `Obadiah`,
	JON: `Jonah`,
	MIC: `Micah`,
	NAM: `Nahum`,
	HAB: `Habakkuk`,
	ZEP: `Zephaniah`,
	HAG: `Haggai`,
	ZEC: `Zechariah`,
	MAL: `Malachi`,
	MAT: `Matthew`,
	MRK: `Mark`,
	LUK: `Luke`,
	JHN: `John`,
	ACT: `Acts`,
	ROM: `Romans`,
	'1CO': `1 Corinthians`,
	'2CO': `2 Corinthians`,
	GAL: `Galatians`,
	EPH: `Ephesians`,
	PHP: `Philippians`,
	COL: `Colossians`,
	'1TH': `1 Thessalonians`,
	'2TH': `2 Thessalonians`,
	'1TI': `1 Timothy`,
	'2TI': `2 Timothy`,
	TIT: `Titus`,
	PHM: `Philemon`,
	HEB: `Hebrews`,
	JAS: `James`,
	'1PE': `1 Peter`,
	'2PE': `2 Peter`,
	'1JN': `1 John`,
	'2JN': `2 John`,
	'3JN': `3 John`,
	JUD: `Jude`,
	REV: `Revelation`,
}

const allFiles = [ `1CH.htm`, `1CH01.htm`, `1CH02.htm`, `1CH03.htm`, `1CH04.htm`, `1CH05.htm`, `1CH06.htm`, `1CH07.htm`, `1CH08.htm`, `1CH09.htm`, `1CH10.htm`, `1CH11.htm`, `1CH12.htm`, `1CH13.htm`, `1CH14.htm`, `1CH15.htm`, `1CH16.htm`, `1CH17.htm`, `1CH18.htm`, `1CH19.htm`, `1CH20.htm`, `1CH21.htm`, `1CH22.htm`, `1CH23.htm`, `1CH24.htm`, `1CH25.htm`, `1CH26.htm`, `1CH27.htm`, `1CH28.htm`, `1CH29.htm`, `1CO.htm`, `1CO01.htm`, `1CO02.htm`, `1CO03.htm`, `1CO04.htm`, `1CO05.htm`, `1CO06.htm`, `1CO07.htm`, `1CO08.htm`, `1CO09.htm`, `1CO10.htm`, `1CO11.htm`, `1CO12.htm`, `1CO13.htm`, `1CO14.htm`, `1CO15.htm`, `1CO16.htm`, `1ES.htm`, `1ES01.htm`, `1ES02.htm`, `1ES03.htm`, `1ES04.htm`, `1ES05.htm`, `1ES06.htm`, `1ES07.htm`, `1ES08.htm`, `1ES09.htm`, `1JN.htm`, `1JN01.htm`, `1JN02.htm`, `1JN03.htm`, `1JN04.htm`, `1JN05.htm`, `1KI.htm`, `1KI01.htm`, `1KI02.htm`, `1KI03.htm`, `1KI04.htm`, `1KI05.htm`, `1KI06.htm`, `1KI07.htm`, `1KI08.htm`, `1KI09.htm`, `1KI10.htm`, `1KI11.htm`, `1KI12.htm`, `1KI13.htm`, `1KI14.htm`, `1KI15.htm`, `1KI16.htm`, `1KI17.htm`, `1KI18.htm`, `1KI19.htm`, `1KI20.htm`, `1KI21.htm`, `1KI22.htm`, `1MA.htm`, `1MA01.htm`, `1MA02.htm`, `1MA03.htm`, `1MA04.htm`, `1MA05.htm`, `1MA06.htm`, `1MA07.htm`, `1MA08.htm`, `1MA09.htm`, `1MA10.htm`, `1MA11.htm`, `1MA12.htm`, `1MA13.htm`, `1MA14.htm`, `1MA15.htm`, `1MA16.htm`, `1PE.htm`, `1PE01.htm`, `1PE02.htm`, `1PE03.htm`, `1PE04.htm`, `1PE05.htm`, `1SA.htm`, `1SA01.htm`, `1SA02.htm`, `1SA03.htm`, `1SA04.htm`, `1SA05.htm`, `1SA06.htm`, `1SA07.htm`, `1SA08.htm`, `1SA09.htm`, `1SA10.htm`, `1SA11.htm`, `1SA12.htm`, `1SA13.htm`, `1SA14.htm`, `1SA15.htm`, `1SA16.htm`, `1SA17.htm`, `1SA18.htm`, `1SA19.htm`, `1SA20.htm`, `1SA21.htm`, `1SA22.htm`, `1SA23.htm`, `1SA24.htm`, `1SA25.htm`, `1SA26.htm`, `1SA27.htm`, `1SA28.htm`, `1SA29.htm`, `1SA30.htm`, `1SA31.htm`, `1TH.htm`, `1TH01.htm`, `1TH02.htm`, `1TH03.htm`, `1TH04.htm`, `1TH05.htm`, `1TI.htm`, `1TI01.htm`, `1TI02.htm`, `1TI03.htm`, `1TI04.htm`, `1TI05.htm`, `1TI06.htm`, `2CH.htm`, `2CH01.htm`, `2CH02.htm`, `2CH03.htm`, `2CH04.htm`, `2CH05.htm`, `2CH06.htm`, `2CH07.htm`, `2CH08.htm`, `2CH09.htm`, `2CH10.htm`, `2CH11.htm`, `2CH12.htm`, `2CH13.htm`, `2CH14.htm`, `2CH15.htm`, `2CH16.htm`, `2CH17.htm`, `2CH18.htm`, `2CH19.htm`, `2CH20.htm`, `2CH21.htm`, `2CH22.htm`, `2CH23.htm`, `2CH24.htm`, `2CH25.htm`, `2CH26.htm`, `2CH27.htm`, `2CH28.htm`, `2CH29.htm`, `2CH30.htm`, `2CH31.htm`, `2CH32.htm`, `2CH33.htm`, `2CH34.htm`, `2CH35.htm`, `2CH36.htm`, `2CO.htm`, `2CO01.htm`, `2CO02.htm`, `2CO03.htm`, `2CO04.htm`, `2CO05.htm`, `2CO06.htm`, `2CO07.htm`, `2CO08.htm`, `2CO09.htm`, `2CO10.htm`, `2CO11.htm`, `2CO12.htm`, `2CO13.htm`, `2ES.htm`, `2ES01.htm`, `2ES02.htm`, `2ES03.htm`, `2ES04.htm`, `2ES05.htm`, `2ES06.htm`, `2ES07.htm`, `2ES08.htm`, `2ES09.htm`, `2ES10.htm`, `2ES11.htm`, `2ES12.htm`, `2ES13.htm`, `2ES14.htm`, `2ES15.htm`, `2ES16.htm`, `2JN.htm`, `2JN01.htm`, `2KI.htm`, `2KI01.htm`, `2KI02.htm`, `2KI03.htm`, `2KI04.htm`, `2KI05.htm`, `2KI06.htm`, `2KI07.htm`, `2KI08.htm`, `2KI09.htm`, `2KI10.htm`, `2KI11.htm`, `2KI12.htm`, `2KI13.htm`, `2KI14.htm`, `2KI15.htm`, `2KI16.htm`, `2KI17.htm`, `2KI18.htm`, `2KI19.htm`, `2KI20.htm`, `2KI21.htm`, `2KI22.htm`, `2KI23.htm`, `2KI24.htm`, `2KI25.htm`, `2MA.htm`, `2MA01.htm`, `2MA02.htm`, `2MA03.htm`, `2MA04.htm`, `2MA05.htm`, `2MA06.htm`, `2MA07.htm`, `2MA08.htm`, `2MA09.htm`, `2MA10.htm`, `2MA11.htm`, `2MA12.htm`, `2MA13.htm`, `2MA14.htm`, `2MA15.htm`, `2PE.htm`, `2PE01.htm`, `2PE02.htm`, `2PE03.htm`, `2SA.htm`, `2SA01.htm`, `2SA02.htm`, `2SA03.htm`, `2SA04.htm`, `2SA05.htm`, `2SA06.htm`, `2SA07.htm`, `2SA08.htm`, `2SA09.htm`, `2SA10.htm`, `2SA11.htm`, `2SA12.htm`, `2SA13.htm`, `2SA14.htm`, `2SA15.htm`, `2SA16.htm`, `2SA17.htm`, `2SA18.htm`, `2SA19.htm`, `2SA20.htm`, `2SA21.htm`, `2SA22.htm`, `2SA23.htm`, `2SA24.htm`, `2TH.htm`, `2TH01.htm`, `2TH02.htm`, `2TH03.htm`, `2TI.htm`, `2TI01.htm`, `2TI02.htm`, `2TI03.htm`, `2TI04.htm`, `3JN.htm`, `3JN01.htm`, `3MA.htm`, `3MA01.htm`, `3MA02.htm`, `3MA03.htm`, `3MA04.htm`, `3MA05.htm`, `3MA06.htm`, `3MA07.htm`, `4MA.htm`, `4MA01.htm`, `4MA02.htm`, `4MA03.htm`, `4MA04.htm`, `4MA05.htm`, `4MA06.htm`, `4MA07.htm`, `4MA08.htm`, `4MA09.htm`, `4MA10.htm`, `4MA11.htm`, `4MA12.htm`, `4MA13.htm`, `4MA14.htm`, `4MA15.htm`, `4MA16.htm`, `4MA17.htm`, `4MA18.htm`, `ACT.htm`, `ACT01.htm`, `ACT02.htm`, `ACT03.htm`, `ACT04.htm`, `ACT05.htm`, `ACT06.htm`, `ACT07.htm`, `ACT08.htm`, `ACT09.htm`, `ACT10.htm`, `ACT11.htm`, `ACT12.htm`, `ACT13.htm`, `ACT14.htm`, `ACT15.htm`, `ACT16.htm`, `ACT17.htm`, `ACT18.htm`, `ACT19.htm`, `ACT20.htm`, `ACT21.htm`, `ACT22.htm`, `ACT23.htm`, `ACT24.htm`, `ACT25.htm`, `ACT26.htm`, `ACT27.htm`, `ACT28.htm`, `AMO.htm`, `AMO01.htm`, `AMO02.htm`, `AMO03.htm`, `AMO04.htm`, `AMO05.htm`, `AMO06.htm`, `AMO07.htm`, `AMO08.htm`, `AMO09.htm`, `BAR.htm`, `BAR00.htm`, `BAR01.htm`, `BAR02.htm`, `BAR03.htm`, `BAR04.htm`, `BAR05.htm`, `BAR06.htm`, `COL.htm`, `COL01.htm`, `COL02.htm`, `COL03.htm`, `COL04.htm`, `DAG.htm`, `DAG00.htm`, `DAG01.htm`, `DAG02.htm`, `DAG03.htm`, `DAG04.htm`, `DAG05.htm`, `DAG06.htm`, `DAG07.htm`, `DAG08.htm`, `DAG09.htm`, `DAG10.htm`, `DAG11.htm`, `DAG12.htm`, `DAG13.htm`, `DAG14.htm`, `DAN.htm`, `DAN01.htm`, `DAN02.htm`, `DAN03.htm`, `DAN04.htm`, `DAN05.htm`, `DAN06.htm`, `DAN07.htm`, `DAN08.htm`, `DAN09.htm`, `DAN10.htm`, `DAN11.htm`, `DAN12.htm`, `DEU.htm`, `DEU01.htm`, `DEU02.htm`, `DEU03.htm`, `DEU04.htm`, `DEU05.htm`, `DEU06.htm`, `DEU07.htm`, `DEU08.htm`, `DEU09.htm`, `DEU10.htm`, `DEU11.htm`, `DEU12.htm`, `DEU13.htm`, `DEU14.htm`, `DEU15.htm`, `DEU16.htm`, `DEU17.htm`, `DEU18.htm`, `DEU19.htm`, `DEU20.htm`, `DEU21.htm`, `DEU22.htm`, `DEU23.htm`, `DEU24.htm`, `DEU25.htm`, `DEU26.htm`, `DEU27.htm`, `DEU28.htm`, `DEU29.htm`, `DEU30.htm`, `DEU31.htm`, `DEU32.htm`, `DEU33.htm`, `DEU34.htm`, `ECC.htm`, `ECC01.htm`, `ECC02.htm`, `ECC03.htm`, `ECC04.htm`, `ECC05.htm`, `ECC06.htm`, `ECC07.htm`, `ECC08.htm`, `ECC09.htm`, `ECC10.htm`, `ECC11.htm`, `ECC12.htm`, `EPH.htm`, `EPH01.htm`, `EPH02.htm`, `EPH03.htm`, `EPH04.htm`, `EPH05.htm`, `EPH06.htm`, `ESG.htm`, `ESG01.htm`, `ESG02.htm`, `ESG03.htm`, `ESG04.htm`, `ESG05.htm`, `ESG06.htm`, `ESG07.htm`, `ESG08.htm`, `ESG09.htm`, `ESG10.htm`, `EST.htm`, `EST01.htm`, `EST02.htm`, `EST03.htm`, `EST04.htm`, `EST05.htm`, `EST06.htm`, `EST07.htm`, `EST08.htm`, `EST09.htm`, `EST10.htm`, `EXO.htm`, `EXO01.htm`, `EXO02.htm`, `EXO03.htm`, `EXO04.htm`, `EXO05.htm`, `EXO06.htm`, `EXO07.htm`, `EXO08.htm`, `EXO09.htm`, `EXO10.htm`, `EXO11.htm`, `EXO12.htm`, `EXO13.htm`, `EXO14.htm`, `EXO15.htm`, `EXO16.htm`, `EXO17.htm`, `EXO18.htm`, `EXO19.htm`, `EXO20.htm`, `EXO21.htm`, `EXO22.htm`, `EXO23.htm`, `EXO24.htm`, `EXO25.htm`, `EXO26.htm`, `EXO27.htm`, `EXO28.htm`, `EXO29.htm`, `EXO30.htm`, `EXO31.htm`, `EXO32.htm`, `EXO33.htm`, `EXO34.htm`, `EXO35.htm`, `EXO36.htm`, `EXO37.htm`, `EXO38.htm`, `EXO39.htm`, `EXO40.htm`, `EZK.htm`, `EZK01.htm`, `EZK02.htm`, `EZK03.htm`, `EZK04.htm`, `EZK05.htm`, `EZK06.htm`, `EZK07.htm`, `EZK08.htm`, `EZK09.htm`, `EZK10.htm`, `EZK11.htm`, `EZK12.htm`, `EZK13.htm`, `EZK14.htm`, `EZK15.htm`, `EZK16.htm`, `EZK17.htm`, `EZK18.htm`, `EZK19.htm`, `EZK20.htm`, `EZK21.htm`, `EZK22.htm`, `EZK23.htm`, `EZK24.htm`, `EZK25.htm`, `EZK26.htm`, `EZK27.htm`, `EZK28.htm`, `EZK29.htm`, `EZK30.htm`, `EZK31.htm`, `EZK32.htm`, `EZK33.htm`, `EZK34.htm`, `EZK35.htm`, `EZK36.htm`, `EZK37.htm`, `EZK38.htm`, `EZK39.htm`, `EZK40.htm`, `EZK41.htm`, `EZK42.htm`, `EZK43.htm`, `EZK44.htm`, `EZK45.htm`, `EZK46.htm`, `EZK47.htm`, `EZK48.htm`, `EZR.htm`, `EZR01.htm`, `EZR02.htm`, `EZR03.htm`, `EZR04.htm`, `EZR05.htm`, `EZR06.htm`, `EZR07.htm`, `EZR08.htm`, `EZR09.htm`, `EZR10.htm`, `FRT.htm`, `FRT01.htm`, `GAL.htm`, `GAL01.htm`, `GAL02.htm`, `GAL03.htm`, `GAL04.htm`, `GAL05.htm`, `GAL06.htm`, `GEN.htm`, `GEN01.htm`, `GEN02.htm`, `GEN03.htm`, `GEN04.htm`, `GEN05.htm`, `GEN06.htm`, `GEN07.htm`, `GEN08.htm`, `GEN09.htm`, `GEN10.htm`, `GEN11.htm`, `GEN12.htm`, `GEN13.htm`, `GEN14.htm`, `GEN15.htm`, `GEN16.htm`, `GEN17.htm`, `GEN18.htm`, `GEN19.htm`, `GEN20.htm`, `GEN21.htm`, `GEN22.htm`, `GEN23.htm`, `GEN24.htm`, `GEN25.htm`, `GEN26.htm`, `GEN27.htm`, `GEN28.htm`, `GEN29.htm`, `GEN30.htm`, `GEN31.htm`, `GEN32.htm`, `GEN33.htm`, `GEN34.htm`, `GEN35.htm`, `GEN36.htm`, `GEN37.htm`, `GEN38.htm`, `GEN39.htm`, `GEN40.htm`, `GEN41.htm`, `GEN42.htm`, `GEN43.htm`, `GEN44.htm`, `GEN45.htm`, `GEN46.htm`, `GEN47.htm`, `GEN48.htm`, `GEN49.htm`, `GEN50.htm`, `GLO.htm`, `GLO01.htm`, `HAB.htm`, `HAB01.htm`, `HAB02.htm`, `HAB03.htm`, `HAG.htm`, `HAG01.htm`, `HAG02.htm`, `HEB.htm`, `HEB01.htm`, `HEB02.htm`, `HEB03.htm`, `HEB04.htm`, `HEB05.htm`, `HEB06.htm`, `HEB07.htm`, `HEB08.htm`, `HEB09.htm`, `HEB10.htm`, `HEB11.htm`, `HEB12.htm`, `HEB13.htm`, `HOS.htm`, `HOS01.htm`, `HOS02.htm`, `HOS03.htm`, `HOS04.htm`, `HOS05.htm`, `HOS06.htm`, `HOS07.htm`, `HOS08.htm`, `HOS09.htm`, `HOS10.htm`, `HOS11.htm`, `HOS12.htm`, `HOS13.htm`, `HOS14.htm`, `ISA.htm`, `ISA01.htm`, `ISA02.htm`, `ISA03.htm`, `ISA04.htm`, `ISA05.htm`, `ISA06.htm`, `ISA07.htm`, `ISA08.htm`, `ISA09.htm`, `ISA10.htm`, `ISA11.htm`, `ISA12.htm`, `ISA13.htm`, `ISA14.htm`, `ISA15.htm`, `ISA16.htm`, `ISA17.htm`, `ISA18.htm`, `ISA19.htm`, `ISA20.htm`, `ISA21.htm`, `ISA22.htm`, `ISA23.htm`, `ISA24.htm`, `ISA25.htm`, `ISA26.htm`, `ISA27.htm`, `ISA28.htm`, `ISA29.htm`, `ISA30.htm`, `ISA31.htm`, `ISA32.htm`, `ISA33.htm`, `ISA34.htm`, `ISA35.htm`, `ISA36.htm`, `ISA37.htm`, `ISA38.htm`, `ISA39.htm`, `ISA40.htm`, `ISA41.htm`, `ISA42.htm`, `ISA43.htm`, `ISA44.htm`, `ISA45.htm`, `ISA46.htm`, `ISA47.htm`, `ISA48.htm`, `ISA49.htm`, `ISA50.htm`, `ISA51.htm`, `ISA52.htm`, `ISA53.htm`, `ISA54.htm`, `ISA55.htm`, `ISA56.htm`, `ISA57.htm`, `ISA58.htm`, `ISA59.htm`, `ISA60.htm`, `ISA61.htm`, `ISA62.htm`, `ISA63.htm`, `ISA64.htm`, `ISA65.htm`, `ISA66.htm`, `JAS.htm`, `JAS01.htm`, `JAS02.htm`, `JAS03.htm`, `JAS04.htm`, `JAS05.htm`, `JDG.htm`, `JDG01.htm`, `JDG02.htm`, `JDG03.htm`, `JDG04.htm`, `JDG05.htm`, `JDG06.htm`, `JDG07.htm`, `JDG08.htm`, `JDG09.htm`, `JDG10.htm`, `JDG11.htm`, `JDG12.htm`, `JDG13.htm`, `JDG14.htm`, `JDG15.htm`, `JDG16.htm`, `JDG17.htm`, `JDG18.htm`, `JDG19.htm`, `JDG20.htm`, `JDG21.htm`, `JDT.htm`, `JDT01.htm`, `JDT02.htm`, `JDT03.htm`, `JDT04.htm`, `JDT05.htm`, `JDT06.htm`, `JDT07.htm`, `JDT08.htm`, `JDT09.htm`, `JDT10.htm`, `JDT11.htm`, `JDT12.htm`, `JDT13.htm`, `JDT14.htm`, `JDT15.htm`, `JDT16.htm`, `JER.htm`, `JER01.htm`, `JER02.htm`, `JER03.htm`, `JER04.htm`, `JER05.htm`, `JER06.htm`, `JER07.htm`, `JER08.htm`, `JER09.htm`, `JER10.htm`, `JER11.htm`, `JER12.htm`, `JER13.htm`, `JER14.htm`, `JER15.htm`, `JER16.htm`, `JER17.htm`, `JER18.htm`, `JER19.htm`, `JER20.htm`, `JER21.htm`, `JER22.htm`, `JER23.htm`, `JER24.htm`, `JER25.htm`, `JER26.htm`, `JER27.htm`, `JER28.htm`, `JER29.htm`, `JER30.htm`, `JER31.htm`, `JER32.htm`, `JER33.htm`, `JER34.htm`, `JER35.htm`, `JER36.htm`, `JER37.htm`, `JER38.htm`, `JER39.htm`, `JER40.htm`, `JER41.htm`, `JER42.htm`, `JER43.htm`, `JER44.htm`, `JER45.htm`, `JER46.htm`, `JER47.htm`, `JER48.htm`, `JER49.htm`, `JER50.htm`, `JER51.htm`, `JER52.htm`, `JHN.htm`, `JHN01.htm`, `JHN02.htm`, `JHN03.htm`, `JHN04.htm`, `JHN05.htm`, `JHN06.htm`, `JHN07.htm`, `JHN08.htm`, `JHN09.htm`, `JHN10.htm`, `JHN11.htm`, `JHN12.htm`, `JHN13.htm`, `JHN14.htm`, `JHN15.htm`, `JHN16.htm`, `JHN17.htm`, `JHN18.htm`, `JHN19.htm`, `JHN20.htm`, `JHN21.htm`, `JOB.htm`, `JOB01.htm`, `JOB02.htm`, `JOB03.htm`, `JOB04.htm`, `JOB05.htm`, `JOB06.htm`, `JOB07.htm`, `JOB08.htm`, `JOB09.htm`, `JOB10.htm`, `JOB11.htm`, `JOB12.htm`, `JOB13.htm`, `JOB14.htm`, `JOB15.htm`, `JOB16.htm`, `JOB17.htm`, `JOB18.htm`, `JOB19.htm`, `JOB20.htm`, `JOB21.htm`, `JOB22.htm`, `JOB23.htm`, `JOB24.htm`, `JOB25.htm`, `JOB26.htm`, `JOB27.htm`, `JOB28.htm`, `JOB29.htm`, `JOB30.htm`, `JOB31.htm`, `JOB32.htm`, `JOB33.htm`, `JOB34.htm`, `JOB35.htm`, `JOB36.htm`, `JOB37.htm`, `JOB38.htm`, `JOB39.htm`, `JOB40.htm`, `JOB41.htm`, `JOB42.htm`, `JOL.htm`, `JOL01.htm`, `JOL02.htm`, `JOL03.htm`, `JON.htm`, `JON01.htm`, `JON02.htm`, `JON03.htm`, `JON04.htm`, `JOS.htm`, `JOS01.htm`, `JOS02.htm`, `JOS03.htm`, `JOS04.htm`, `JOS05.htm`, `JOS06.htm`, `JOS07.htm`, `JOS08.htm`, `JOS09.htm`, `JOS10.htm`, `JOS11.htm`, `JOS12.htm`, `JOS13.htm`, `JOS14.htm`, `JOS15.htm`, `JOS16.htm`, `JOS17.htm`, `JOS18.htm`, `JOS19.htm`, `JOS20.htm`, `JOS21.htm`, `JOS22.htm`, `JOS23.htm`, `JOS24.htm`, `JUD.htm`, `JUD01.htm`, `LAM.htm`, `LAM01.htm`, `LAM02.htm`, `LAM03.htm`, `LAM04.htm`, `LAM05.htm`, `LEV.htm`, `LEV01.htm`, `LEV02.htm`, `LEV03.htm`, `LEV04.htm`, `LEV05.htm`, `LEV06.htm`, `LEV07.htm`, `LEV08.htm`, `LEV09.htm`, `LEV10.htm`, `LEV11.htm`, `LEV12.htm`, `LEV13.htm`, `LEV14.htm`, `LEV15.htm`, `LEV16.htm`, `LEV17.htm`, `LEV18.htm`, `LEV19.htm`, `LEV20.htm`, `LEV21.htm`, `LEV22.htm`, `LEV23.htm`, `LEV24.htm`, `LEV25.htm`, `LEV26.htm`, `LEV27.htm`, `LUK.htm`, `LUK01.htm`, `LUK02.htm`, `LUK03.htm`, `LUK04.htm`, `LUK05.htm`, `LUK06.htm`, `LUK07.htm`, `LUK08.htm`, `LUK09.htm`, `LUK10.htm`, `LUK11.htm`, `LUK12.htm`, `LUK13.htm`, `LUK14.htm`, `LUK15.htm`, `LUK16.htm`, `LUK17.htm`, `LUK18.htm`, `LUK19.htm`, `LUK20.htm`, `LUK21.htm`, `LUK22.htm`, `LUK23.htm`, `LUK24.htm`, `MAL.htm`, `MAL01.htm`, `MAL02.htm`, `MAL03.htm`, `MAL04.htm`, `MAN.htm`, `MAN01.htm`, `MAT.htm`, `MAT01.htm`, `MAT02.htm`, `MAT03.htm`, `MAT04.htm`, `MAT05.htm`, `MAT06.htm`, `MAT07.htm`, `MAT08.htm`, `MAT09.htm`, `MAT10.htm`, `MAT11.htm`, `MAT12.htm`, `MAT13.htm`, `MAT14.htm`, `MAT15.htm`, `MAT16.htm`, `MAT17.htm`, `MAT18.htm`, `MAT19.htm`, `MAT20.htm`, `MAT21.htm`, `MAT22.htm`, `MAT23.htm`, `MAT24.htm`, `MAT25.htm`, `MAT26.htm`, `MAT27.htm`, `MAT28.htm`, `MIC.htm`, `MIC01.htm`, `MIC02.htm`, `MIC03.htm`, `MIC04.htm`, `MIC05.htm`, `MIC06.htm`, `MIC07.htm`, `MRK.htm`, `MRK01.htm`, `MRK02.htm`, `MRK03.htm`, `MRK04.htm`, `MRK05.htm`, `MRK06.htm`, `MRK07.htm`, `MRK08.htm`, `MRK09.htm`, `MRK10.htm`, `MRK11.htm`, `MRK12.htm`, `MRK13.htm`, `MRK14.htm`, `MRK15.htm`, `MRK16.htm`, `NAM.htm`, `NAM01.htm`, `NAM02.htm`, `NAM03.htm`, `NEH.htm`, `NEH01.htm`, `NEH02.htm`, `NEH03.htm`, `NEH04.htm`, `NEH05.htm`, `NEH06.htm`, `NEH07.htm`, `NEH08.htm`, `NEH09.htm`, `NEH10.htm`, `NEH11.htm`, `NEH12.htm`, `NEH13.htm`, `NUM.htm`, `NUM01.htm`, `NUM02.htm`, `NUM03.htm`, `NUM04.htm`, `NUM05.htm`, `NUM06.htm`, `NUM07.htm`, `NUM08.htm`, `NUM09.htm`, `NUM10.htm`, `NUM11.htm`, `NUM12.htm`, `NUM13.htm`, `NUM14.htm`, `NUM15.htm`, `NUM16.htm`, `NUM17.htm`, `NUM18.htm`, `NUM19.htm`, `NUM20.htm`, `NUM21.htm`, `NUM22.htm`, `NUM23.htm`, `NUM24.htm`, `NUM25.htm`, `NUM26.htm`, `NUM27.htm`, `NUM28.htm`, `NUM29.htm`, `NUM30.htm`, `NUM31.htm`, `NUM32.htm`, `NUM33.htm`, `NUM34.htm`, `NUM35.htm`, `NUM36.htm`, `OBA.htm`, `OBA01.htm`, `PHM.htm`, `PHM01.htm`, `PHP.htm`, `PHP01.htm`, `PHP02.htm`, `PHP03.htm`, `PHP04.htm`, `PRO.htm`, `PRO01.htm`, `PRO02.htm`, `PRO03.htm`, `PRO04.htm`, `PRO05.htm`, `PRO06.htm`, `PRO07.htm`, `PRO08.htm`, `PRO09.htm`, `PRO10.htm`, `PRO11.htm`, `PRO12.htm`, `PRO13.htm`, `PRO14.htm`, `PRO15.htm`, `PRO16.htm`, `PRO17.htm`, `PRO18.htm`, `PRO19.htm`, `PRO20.htm`, `PRO21.htm`, `PRO22.htm`, `PRO23.htm`, `PRO24.htm`, `PRO25.htm`, `PRO26.htm`, `PRO27.htm`, `PRO28.htm`, `PRO29.htm`, `PRO30.htm`, `PRO31.htm`, `PS2.htm`, `PS200.htm`, `PS201.htm`, `PSA.htm`, `PSA000.htm`, `PSA001.htm`, `PSA002.htm`, `PSA003.htm`, `PSA004.htm`, `PSA005.htm`, `PSA006.htm`, `PSA007.htm`, `PSA008.htm`, `PSA009.htm`, `PSA010.htm`, `PSA011.htm`, `PSA012.htm`, `PSA013.htm`, `PSA014.htm`, `PSA015.htm`, `PSA016.htm`, `PSA017.htm`, `PSA018.htm`, `PSA019.htm`, `PSA020.htm`, `PSA021.htm`, `PSA022.htm`, `PSA023.htm`, `PSA024.htm`, `PSA025.htm`, `PSA026.htm`, `PSA027.htm`, `PSA028.htm`, `PSA029.htm`, `PSA030.htm`, `PSA031.htm`, `PSA032.htm`, `PSA033.htm`, `PSA034.htm`, `PSA035.htm`, `PSA036.htm`, `PSA037.htm`, `PSA038.htm`, `PSA039.htm`, `PSA040.htm`, `PSA041.htm`, `PSA042.htm`, `PSA043.htm`, `PSA044.htm`, `PSA045.htm`, `PSA046.htm`, `PSA047.htm`, `PSA048.htm`, `PSA049.htm`, `PSA050.htm`, `PSA051.htm`, `PSA052.htm`, `PSA053.htm`, `PSA054.htm`, `PSA055.htm`, `PSA056.htm`, `PSA057.htm`, `PSA058.htm`, `PSA059.htm`, `PSA060.htm`, `PSA061.htm`, `PSA062.htm`, `PSA063.htm`, `PSA064.htm`, `PSA065.htm`, `PSA066.htm`, `PSA067.htm`, `PSA068.htm`, `PSA069.htm`, `PSA070.htm`, `PSA071.htm`, `PSA072.htm`, `PSA073.htm`, `PSA074.htm`, `PSA075.htm`, `PSA076.htm`, `PSA077.htm`, `PSA078.htm`, `PSA079.htm`, `PSA080.htm`, `PSA081.htm`, `PSA082.htm`, `PSA083.htm`, `PSA084.htm`, `PSA085.htm`, `PSA086.htm`, `PSA087.htm`, `PSA088.htm`, `PSA089.htm`, `PSA090.htm`, `PSA091.htm`, `PSA092.htm`, `PSA093.htm`, `PSA094.htm`, `PSA095.htm`, `PSA096.htm`, `PSA097.htm`, `PSA098.htm`, `PSA099.htm`, `PSA100.htm`, `PSA101.htm`, `PSA102.htm`, `PSA103.htm`, `PSA104.htm`, `PSA105.htm`, `PSA106.htm`, `PSA107.htm`, `PSA108.htm`, `PSA109.htm`, `PSA110.htm`, `PSA111.htm`, `PSA112.htm`, `PSA113.htm`, `PSA114.htm`, `PSA115.htm`, `PSA116.htm`, `PSA117.htm`, `PSA118.htm`, `PSA119.htm`, `PSA120.htm`, `PSA121.htm`, `PSA122.htm`, `PSA123.htm`, `PSA124.htm`, `PSA125.htm`, `PSA126.htm`, `PSA127.htm`, `PSA128.htm`, `PSA129.htm`, `PSA130.htm`, `PSA131.htm`, `PSA132.htm`, `PSA133.htm`, `PSA134.htm`, `PSA135.htm`, `PSA136.htm`, `PSA137.htm`, `PSA138.htm`, `PSA139.htm`, `PSA140.htm`, `PSA141.htm`, `PSA142.htm`, `PSA143.htm`, `PSA144.htm`, `PSA145.htm`, `PSA146.htm`, `PSA147.htm`, `PSA148.htm`, `PSA149.htm`, `PSA150.htm`, `REV.htm`, `REV01.htm`, `REV02.htm`, `REV03.htm`, `REV04.htm`, `REV05.htm`, `REV06.htm`, `REV07.htm`, `REV08.htm`, `REV09.htm`, `REV10.htm`, `REV11.htm`, `REV12.htm`, `REV13.htm`, `REV14.htm`, `REV15.htm`, `REV16.htm`, `REV17.htm`, `REV18.htm`, `REV19.htm`, `REV20.htm`, `REV21.htm`, `REV22.htm`, `ROM.htm`, `ROM01.htm`, `ROM02.htm`, `ROM03.htm`, `ROM04.htm`, `ROM05.htm`, `ROM06.htm`, `ROM07.htm`, `ROM08.htm`, `ROM09.htm`, `ROM10.htm`, `ROM11.htm`, `ROM12.htm`, `ROM13.htm`, `ROM14.htm`, `ROM15.htm`, `ROM16.htm`, `RUT.htm`, `RUT01.htm`, `RUT02.htm`, `RUT03.htm`, `RUT04.htm`, `SIR.htm`, `SIR01.htm`, `SIR02.htm`, `SIR03.htm`, `SIR04.htm`, `SIR05.htm`, `SIR06.htm`, `SIR07.htm`, `SIR08.htm`, `SIR09.htm`, `SIR10.htm`, `SIR11.htm`, `SIR12.htm`, `SIR13.htm`, `SIR14.htm`, `SIR15.htm`, `SIR16.htm`, `SIR17.htm`, `SIR18.htm`, `SIR19.htm`, `SIR20.htm`, `SIR21.htm`, `SIR22.htm`, `SIR23.htm`, `SIR24.htm`, `SIR25.htm`, `SIR26.htm`, `SIR27.htm`, `SIR28.htm`, `SIR29.htm`, `SIR30.htm`, `SIR31.htm`, `SIR32.htm`, `SIR33.htm`, `SIR34.htm`, `SIR35.htm`, `SIR36.htm`, `SIR37.htm`, `SIR38.htm`, `SIR39.htm`, `SIR40.htm`, `SIR41.htm`, `SIR42.htm`, `SIR43.htm`, `SIR44.htm`, `SIR45.htm`, `SIR46.htm`, `SIR47.htm`, `SIR48.htm`, `SIR49.htm`, `SIR50.htm`, `SIR51.htm`, `SNG.htm`, `SNG01.htm`, `SNG02.htm`, `SNG03.htm`, `SNG04.htm`, `SNG05.htm`, `SNG06.htm`, `SNG07.htm`, `SNG08.htm`, `TIT.htm`, `TIT01.htm`, `TIT02.htm`, `TIT03.htm`, `TOB.htm`, `TOB01.htm`, `TOB02.htm`, `TOB03.htm`, `TOB04.htm`, `TOB05.htm`, `TOB06.htm`, `TOB07.htm`, `TOB08.htm`, `TOB09.htm`, `TOB10.htm`, `TOB11.htm`, `TOB12.htm`, `TOB13.htm`, `TOB14.htm`, `WIS.htm`, `WIS01.htm`, `WIS02.htm`, `WIS03.htm`, `WIS04.htm`, `WIS05.htm`, `WIS06.htm`, `WIS07.htm`, `WIS08.htm`, `WIS09.htm`, `WIS10.htm`, `WIS11.htm`, `WIS12.htm`, `WIS13.htm`, `WIS14.htm`, `WIS15.htm`, `WIS16.htm`, `WIS17.htm`, `WIS18.htm`, `WIS19.htm`, `ZEC.htm`, `ZEC01.htm`, `ZEC02.htm`, `ZEC03.htm`, `ZEC04.htm`, `ZEC05.htm`, `ZEC06.htm`, `ZEC07.htm`, `ZEC08.htm`, `ZEC09.htm`, `ZEC10.htm`, `ZEC11.htm`, `ZEC12.htm`, `ZEC13.htm`, `ZEC14.htm`, `ZEP.htm`, `ZEP01.htm`, `ZEP02.htm`, `ZEP03.htm`, `copr.htm`, `copyright.htm`, `index.htm`, `indexbar.htm`, `links.htm`, `oldindex.htm`, `webfaq.htm` ]

const paragraphStart = { type: `paragraph start` }
const paragraphEnd = { type: `paragraph end` }
const continuePreviousParagraph = { type: `continue previous paragraph` }

const fileNameRegex = /^[\dA-Z]{3}(\d+)\.htm$/
const filesICareAbout = allFiles.filter(filename => fileNameRegex.test(filename)
	&& books[filename.substring(0, 3)]
)

// const unmatched = {}
// allFiles.filter(filename => fileNameRegex.test(filename))
// 	.forEach(filename => {
// 		const bookAbbreviation = filename.substring(0, 3)
// 		console.log('checking', bookAbbreviation)
// 		if (!books[bookAbbreviation]) {
// 			unmatched[bookAbbreviation] = true
// 		}
// 	})
// console.log(Object.keys(unmatched))
// console.log(JSON.stringify(filesICareAbout, null, '\t'))










const paragraphClasses = [ `p`, `pi`, `nb` ]
const lineClasses = [ `q`, `q2`, `m`, `mi`, `li` ]
const breakClasses = [ `b` ]
const headerClasses = [ `d` ]

const textContainerSelector = [ ...paragraphClasses, ...lineClasses, ...breakClasses, ...headerClasses ]
	.map(clazz => `.main > div.${ clazz }`).join(`, `)

const chapterChunks = filesICareAbout.map(fileName => {
	const bookIdentifier = fileName.substring(0, 3)
	return {
		fileName,
		bookIdentifier,
	}
})
	.filter(({ bookIdentifier }) => books[bookIdentifier])
	// .filter(({ fileName }) => fileName === `JAS01.htm`)
	.map(context => {
		const { fileName, bookIdentifier } = context

		return Object.assign({
			bookName: books[bookIdentifier],
			chapterNumber: parseInt(fileName.match(fileNameRegex)[1], 10),
			contents: fs.readFileSync(path.join(`./html/`, fileName), { encoding: `utf8` }),
		}, context)
	})
	.filter(({ chapterNumber }) => chapterNumber !== 0)
	.map(context => {
		const { contents, fileName, bookName, chapterNumber } = context

		try {
			const $ = cheerio.load(contents)

			const chapterContents = flatten(mapE($(textContainerSelector), textContainer => {
				const clazz = textContainer.attribs.class
				if (breakClasses.indexOf(clazz) !== -1) {
					return {
						type: `break`,
					}
				} else if (headerClasses.indexOf(clazz) !== -1) {
					return {
						type: `header`,
						value: $(textContainer).text().trim(),
					}
				}

				const isParagraph = paragraphClasses.indexOf(clazz) !== -1

				const verseNumbersAndText = mapE($(textContainer).contents(), element => {
					const textType = isParagraph ? `paragraph text` : `line`

					if (element.type === `tag` && element.name === `span` && element.attribs.class === `wj`) {
						return {
							type: textType,
							value: $(element).text(),
						}
					} else if (element.type === `text`) {
						return {
							type: textType,
							value: element.data,
						}
					} else if (element.type === `tag` && element.name === `span` && element.attribs.class === `verse`) {
						return {
							type: `verse number`,
							value: parseInt($(element.children).text().trim(), 10),
						}
					} else {
						return null
					}
				}).filter(item => item !== null)

				const start = clazz === `nb` ? continuePreviousParagraph : paragraphStart

				const containerContents = isParagraph
					? [ start, ...verseNumbersAndText, paragraphEnd ]
					: verseNumbersAndText

				return containerContents
			}))

			// console.log(chapterContents)

			assertVersesCountUpFromOne(chapterContents)

			return {
				chunks: chapterContents,
				chapterNumber,
				bookName,
			}
		} catch (e) {
			console.error(`Error parsing ${ fileName }`)
			throw e
		}
	})

checkChapterChunks(chapterChunks)

fs.writeFileSync(`./intermediate/chapters.json`, JSON.stringify(chapterChunks, null, `\t`))

module.exports = chapterChunks

function checkChapterChunks(chapterChunks) {
	assert(chapterChunks.length === 1189, `Should be 1139 chapters, was ${ chapterChunks.length }`)

	const mapOfBooks = chapterChunks.reduce((map, chapter) => {
		map[chapter.bookName] = map[chapter.bookName] || []
		map[chapter.bookName].push(chapter.chapterNumber)
		return map
	}, {})

	Object.keys(mapOfBooks).forEach(book => {
		const chapterNumbers = mapOfBooks[book]
		assertNoGaps(chapterNumbers, book)
	})
}

function assertNoGaps(arrayOfNumbers, bookName) {
	const sorted = [ ...arrayOfNumbers ].sort((a, b) => a - b)
	let last = 0
	sorted.forEach(number => {
		if (number !== last + 1) {
			throw new Error(`Found ${ number } after ${ last } in ${ bookName }`)
		}
		last = number
	})
}

function assertVersesCountUpFromOne(arrayOfThingsIncludingVerseNumbers) {
	let lastVerseNumber = 0
	arrayOfThingsIncludingVerseNumbers
		.filter(({ type }) => type === `verse number`)
		.forEach(({ value }) => {
			if (value !== lastVerseNumber + 1) {
				throw new Error(`Ran into verse ${ value } after verse ${ lastVerseNumber }`)
			}
			lastVerseNumber = value
		})
}




















































// console.log(Object.keys(mapOfBooks['Genesis'].chapters))

function combineVerseNumbersAndText(currentVerseObject, parsedChunks) {
	const arrayOfCurrentObject = () => currentVerseObject ? [ currentVerseObject ] : []

	if (parsedChunks.length === 0) {
		return arrayOfCurrentObject()
	}

	const [ nextChunk, ...rest ] = parsedChunks

	if (nextChunk.type === `verse number`) {
		const newVerseObject = {
			verseNumber: nextChunk.value,
			text: ``,
		}

		if (currentVerseObject && newVerseObject.verseNumber !== currentVerseObject.verseNumber + 1) {
			throw new Error(`Tried to add verse ${ newVerseObject.verseNumber } after verse ${ currentVerseObject.verseNumber }`)
		}

		return [
			...arrayOfCurrentObject(),
			...combineVerseNumbersAndText(newVerseObject, rest),
		]
	} else if (nextChunk.type === `paragraph text`) {
		const modifiedVerseObject = Object.assign({}, currentVerseObject, {
			text: (currentVerseObject ? currentVerseObject.text : ``) + nextChunk.value,
		})
		return combineVerseNumbersAndText(modifiedVerseObject, rest)
	} else {
		throw new Error(`Don't know what to do with ${ nextChunk }`)
	}
}

function mapE($, fn) {
	const output = []
	$.each((index, element) => {
		output.push(fn(element))
	})
	return output
}

function assert(value, message) {
	if (!value) {
		throw new Error(message || `ASSERT!`)
	}
}
