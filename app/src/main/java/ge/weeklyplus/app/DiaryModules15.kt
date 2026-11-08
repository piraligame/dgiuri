package ge.weeklyplus.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.*
import org.json.JSONArray
import org.json.JSONObject
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.UUID

data class ListEntry(val id:String,val title:String,val done:Boolean=false,val updatedAt:Long=System.currentTimeMillis())
data class JournalEntry(val id:String,val title:String,val body:String,val createdAt:Long,val updatedAt:Long)

class DiaryModules15(context:Context) {
    private val prefs=context.getSharedPreferences("diary_native_modules_015",Context.MODE_PRIVATE)
    val list=mutableStateListOf<ListEntry>()
    val notes=mutableStateListOf<JournalEntry>()
    init {
        runCatching {
            val a=JSONArray(prefs.getString("list","[]")?:"[]")
            for(i in 0 until a.length()){
                val j=a.getJSONObject(i)
                list.add(ListEntry(j.getString("id"),j.getString("title"),j.optBoolean("done"),j.optLong("updatedAt")))
            }
            val b=JSONArray(prefs.getString("notes","[]")?:"[]")
            for(i in 0 until b.length()){
                val j=b.getJSONObject(i)
                notes.add(JournalEntry(j.getString("id"),j.optString("title"),j.getString("body"),j.getLong("createdAt"),j.optLong("updatedAt",j.getLong("createdAt"))))
            }
        }
    }
    private fun save() {
        val l=JSONArray();list.forEach { e->l.put(JSONObject().apply{
            put("id",e.id);put("title",e.title);put("done",e.done);put("updatedAt",e.updatedAt)
        }) }
        val j=JSONArray();notes.forEach { e->j.put(JSONObject().apply{
            put("id",e.id);put("title",e.title);put("body",e.body);put("createdAt",e.createdAt);put("updatedAt",e.updatedAt)
        }) }
        prefs.edit().putString("list",l.toString()).putString("notes",j.toString()).apply()
    }
    fun addList(s:String){if(s.isBlank())return;list.add(0,ListEntry(UUID.randomUUID().toString(),s.trim().take(200)));save()}
    fun toggle(id:String){val i=list.indexOfFirst{it.id==id};if(i>=0){list[i]=list[i].copy(done=!list[i].done,updatedAt=System.currentTimeMillis());save()}}
    fun edit(id:String,s:String){val i=list.indexOfFirst{it.id==id};if(i>=0&&s.isNotBlank()){list[i]=list[i].copy(title=s.trim().take(200),updatedAt=System.currentTimeMillis());save()}}
    fun remove(id:String){list.removeAll{it.id==id};save()}
    fun saveNote(id:String?,title:String,body:String){
        if(body.isBlank())return
        val now=System.currentTimeMillis()
        val i=notes.indexOfFirst{it.id==id}
        if(i>=0)notes[i]=notes[i].copy(title=title.trim().take(160),body=body.trim().take(30000),updatedAt=now)
        else notes.add(0,JournalEntry(UUID.randomUUID().toString(),title.trim().take(160),body.trim().take(30000),now,now))
        save()
    }
    fun removeNote(id:String){notes.removeAll{it.id==id};save()}
    val done get()=list.count{it.done}
    val total get()=list.size
}

@Composable fun DgiuriListPage(model:DiaryModules15){
    var input by remember {mutableStateOf("")}
    var filter by remember {mutableStateOf("open")}
    var editing by remember {mutableStateOf<ListEntry?>(null)}
    var editText by remember {mutableStateOf("")}
    var deleting by remember {mutableStateOf<ListEntry?>(null)}
    val shown=model.list.filter{filter=="all"||(filter=="open"&&!it.done)||(filter=="done"&&it.done)}
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()),verticalArrangement=Arrangement.spacedBy(12.dp)) {
        Text(tr("☑ საერთო სია","☑ General list"),fontSize=25.sp,fontWeight=FontWeight.Bold)
        Text(tr("შესრულებული საქმეები წითლად გადაიხაზება","Completed items are crossed out in red"),fontSize=12.sp,color=MaterialTheme.colorScheme.onSurfaceVariant)
        Surface(color=MaterialTheme.colorScheme.surface,shape=RoundedCornerShape(20.dp),modifier=Modifier.fillMaxWidth()) {
            Column(Modifier.padding(12.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
                Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(7.dp),verticalAlignment=Alignment.CenterVertically) {
                    OutlinedTextField(input,{input=it.take(200)},modifier=Modifier.weight(1f),singleLine=true,
                      placeholder={Text(tr("საქმის დამატება","Add an item"),fontSize=11.sp)})
                    Button(onClick={model.addList(input);input=""},enabled=input.isNotBlank(),modifier=Modifier.width(96.dp).height(52.dp),
                        contentPadding=PaddingValues(5.dp)){Text(tr("＋ დამატება","+ Add"),fontSize=10.sp,maxLines=1)}
                }
                Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically) {
                    Text(model.done.toString()+"/"+model.total.toString(),Modifier.weight(1f),fontWeight=FontWeight.Bold)
                    listOf("open" to tr("შესასრულებელი","To do"),"done" to tr("შესრულებული","Done"),"all" to tr("ყველა","All")).forEach {(key,name)->
                        FilterChip(filter==key,onClick={filter=key},label={Text(name,fontSize=9.sp,maxLines=1)},modifier=Modifier.padding(horizontal=1.dp))
                    }
                }
                LinearProgressIndicator(progress={if(model.total==0)0f else model.done.toFloat()/model.total},modifier=Modifier.fillMaxWidth())
                if(shown.isEmpty())Text(tr("სია ცარიელია","No items"),fontSize=12.sp)
                shown.forEach{e->
                    Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically) {
                        Checkbox(e.done,onCheckedChange={model.toggle(e.id)})
                        Text(e.title,Modifier.weight(1f),fontSize=13.sp,
                            textDecoration=if(e.done)TextDecoration.LineThrough else TextDecoration.None,
                            color=if(e.done)Color(0xFFE55263) else MaterialTheme.colorScheme.onSurface)
                        Text("✎",Modifier.clickable{editing=e;editText=e.title}.padding(8.dp),fontSize=15.sp)
                        Text("×",Modifier.clickable{deleting=e}.padding(8.dp),fontSize=17.sp,color=MaterialTheme.colorScheme.error)
                    }
                    HorizontalDivider()
                }
            }
        }
    }
    if(editing!=null) AlertDialog(onDismissRequest={editing=null},title={Text(tr("საქმის შეცვლა","Edit task"))},
      text={OutlinedTextField(editText,{editText=it.take(200)},singleLine=true)},
      confirmButton={Button(onClick={editing?.let{model.edit(it.id,editText)};editing=null}){Text(tr("შენახვა","Save"))}},
      dismissButton={TextButton(onClick={editing=null}){Text(tr("გაუქმება","Cancel"))}})
    if(deleting!=null)AlertDialog(onDismissRequest={deleting=null},title={Text(tr("წავშალოთ საქმე?","Delete task?"))},
      confirmButton={Button(onClick={deleting?.let{model.remove(it.id)};deleting=null}){Text(tr("წაშლა","Delete"))}},
      dismissButton={TextButton(onClick={deleting=null}){Text(tr("გაუქმება","Cancel"))}})
}

@Composable fun DgiuriOtherPage(onSelect:(String)->Unit) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()),verticalArrangement=Arrangement.spacedBy(13.dp)){
        Text(tr("სხვა","Other"),fontSize=25.sp,fontWeight=FontWeight.Bold)
        listOf(Triple("mydiary","✎",tr("ჩემი დღიური","My diary")),Triple("joker","♠",tr("ჯოკერი","Joker")),Triple("clock","⏱",tr("საათი","Clock"))).forEach{(key,icon,title)->
            Surface(Modifier.fillMaxWidth().clickable{onSelect(key)},shape=RoundedCornerShape(17.dp),color=MaterialTheme.colorScheme.surface){
                Row(Modifier.padding(18.dp),verticalAlignment=Alignment.CenterVertically){
                    Text(icon,fontSize=23.sp,modifier=Modifier.width(43.dp),color=MaterialTheme.colorScheme.primary)
                    Text(title,Modifier.weight(1f),fontWeight=FontWeight.Bold)
                    Text("›",fontSize=24.sp)
                }
            }
        }
        Text(tr("მომავალში დამატებითი ფუნქციები აქ გამოჩნდება","New features will appear here in future updates"),fontSize=12.sp)
    }
}
private fun journalDate(n:Long):String=runCatching{DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")
  .format(Instant.ofEpochMilli(n).atZone(ZoneId.systemDefault()))}.getOrDefault("")

@Composable fun DgiuriJournalPage(model:DiaryModules15,onBack:()->Unit){
    var title by remember{mutableStateOf("")};var body by remember{mutableStateOf("")}
    var editId by remember{mutableStateOf<String?>(null)}
    var search by remember{mutableStateOf("")}
    var deletion by remember{mutableStateOf<JournalEntry?>(null)}
    val found=model.notes.filter{search.isBlank()||it.title.contains(search,true)||it.body.contains(search,true)}
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()),verticalArrangement=Arrangement.spacedBy(12.dp)) {
        TextButton(onClick=onBack){Text("‹ "+tr("სხვა","Other"))}
        Text(tr("ჩემი დღიური","My diary"),fontSize=25.sp,fontWeight=FontWeight.Bold)
        Surface(color=MaterialTheme.colorScheme.surface,shape=RoundedCornerShape(18.dp)){
          Column(Modifier.fillMaxWidth().padding(14.dp),verticalArrangement=Arrangement.spacedBy(10.dp)){
            OutlinedTextField(title,{title=it.take(160)},label={Text(tr("სათაური","Title"))},singleLine=true,modifier=Modifier.fillMaxWidth())
            OutlinedTextField(body,{body=it.take(30000)},label={Text(tr("ჩანაწერი","Entry"))},minLines=5,modifier=Modifier.fillMaxWidth())
            Row {
              if(editId!=null)TextButton(onClick={title="";body="";editId=null}){Text(tr("გაუქმება","Cancel"))}
              Spacer(Modifier.weight(1f))
              Button(onClick={model.saveNote(editId,title,body);title="";body="";editId=null},enabled=body.isNotBlank()){Text(tr("შენახვა","Save"))}
            }
          }
        }
        Text(tr("ჩანაწერების ისტორია","Note history")+" ("+model.notes.size+")",fontWeight=FontWeight.Bold)
        OutlinedTextField(search,{search=it},label={Text(tr("ძებნა","Search"))},modifier=Modifier.fillMaxWidth(),singleLine=true)
        found.sortedByDescending{it.createdAt}.forEach{e->
          Surface(color=MaterialTheme.colorScheme.surface,shape=RoundedCornerShape(16.dp)){
            Column(Modifier.fillMaxWidth().padding(14.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) {
              Text(e.title.ifBlank{tr("უსათაურო","Untitled")},fontWeight=FontWeight.Bold)
              Text(tr("შექმნა: ","Created: ")+journalDate(e.createdAt),fontSize=10.sp,color=MaterialTheme.colorScheme.onSurfaceVariant)
              if(e.updatedAt>e.createdAt)Text(tr("რედაქტირება: ","Updated: ")+journalDate(e.updatedAt),fontSize=10.sp)
              Text(e.body,fontSize=13.sp)
              Row {
                TextButton(onClick={editId=e.id;title=e.title;body=e.body}){Text(tr("შეცვლა","Edit"))}
                TextButton(onClick={deletion=e}){Text(tr("წაშლა","Delete"),color=MaterialTheme.colorScheme.error)}
              }
            }
          }
        }
    }
    if(deletion!=null)AlertDialog(onDismissRequest={deletion=null},title={Text(tr("წავშალოთ ჩანაწერი?","Delete entry?"))},
        confirmButton={Button(onClick={deletion?.let{model.removeNote(it.id)};deletion=null}){Text(tr("წაშლა","Delete"))}},
        dismissButton={TextButton(onClick={deletion=null}){Text(tr("გაუქმება","Cancel"))}})
}

@Composable fun DgiuriAccentSelector(store:PlannerStore){
    val choices=listOf("green" to Color(0xFF197E65),"purple" to Color(0xFF8559AD),"blue" to Color(0xFF3179BF),
      "rose" to Color(0xFFB44D80),"amber" to Color(0xFFB17C27),"cyan" to Color(0xFF109BA0),"slate" to Color(0xFF586575))
    Column(verticalArrangement=Arrangement.spacedBy(9.dp)){
      Text(tr("აპის ფერები","App colors"),fontWeight=FontWeight.Bold)
      Row(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()),horizontalArrangement=Arrangement.spacedBy(7.dp)){
        choices.forEach{(name,c)->
          Box(Modifier.size(38.dp).background(c,RoundedCornerShape(11.dp)).clickable{store.changeAccent(name)},contentAlignment=Alignment.Center){
            if(store.accent==name)Text("✓",color=Color.White,fontWeight=FontWeight.ExtraBold)
          }
        }
      }
    }
}
@Composable fun DgiuriGoogleWebLogin(){
    val context=androidx.compose.ui.platform.LocalContext.current
    Column(verticalArrangement=Arrangement.spacedBy(7.dp)){
      Text(tr("Google ანგარიში","Google account"),fontWeight=FontWeight.Bold)
      Text(tr("Google-ით შესვლა მუშაობს ვებვერსიაში. ამ Android აპის მონაცემები ჯერ ცალკეა და ავტომატურად არ სინქრონიზდება.",
        "Google sign-in is available in the web version. This native app's data is currently separate and does not automatically sync."),
        fontSize=12.sp,color=MaterialTheme.colorScheme.onSurfaceVariant)
      OutlinedButton(onClick={
        context.startActivity(Intent(Intent.ACTION_VIEW,Uri.parse("https://piraligame.github.io/pirali/diary-alpha15-webtest/index.html?v=15")))
      }){Text(tr("Google-ით შესვლა ბრაუზერში","Google sign-in in browser"))}
    }
}
