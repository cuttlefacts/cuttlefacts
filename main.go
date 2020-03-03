package main

import (
	"html/template"
	"log"
	"net/http"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.Handle("/", http.HandlerFunc(index))
	log.Println("Listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Print(err)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("index.html.tmpl"))
	if err := tmpl.Execute(w, "Cuttlefishes are molluscs"); err != nil {
		log.Fatal(err)
	}
	return
}
