FROM golang:1.13.8 as go
COPY main.go ./
RUN go build -tags 'netgo' -ldflags "-linkmode external -extldflags -static" -o /go/cuttlefacts ./main.go

FROM scratch
COPY --from=go /go/cuttlefacts ./
COPY facts.json index.html.tmpl ./
COPY static ./static
ENTRYPOINT ["./cuttlefacts"]
